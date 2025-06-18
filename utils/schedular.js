const cron = require('node-cron')
const Notification = require('@controllers/notifications')

const Store = require('@models/mongodb/schemas/store')
const SubscriptionOwner = require('@models/mongodb/schemas/subscription-owner')

const Variant = require('@models/mongodb/schemas/variant')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')
const TopSelling = require('@models/mongodb/schemas/top-selling')

const AccPayable = require('@models/mongodb/schemas/acc-payable')
const AccReceivable = require('@models/mongodb/schemas/acc-receivable')
const LedgerDaily = require('@models/mongodb/schemas/ledger-daily')

const utils = require('@utils/index')
const sUtils = require('@utils/subscription')

const CHUNK_SIZE = 100

const checkExpireSubscription = async () => {
    try {
        const subscriptionOwners = await SubscriptionOwner.find({})

        subscriptionOwners.forEach(async (subscriptionOwner) => {
            const isExpiredSoon = sUtils.isExpiredSoon(subscriptionOwner)
            if (isExpiredSoon.status) {
                await Notification.addData({
                    title: '🔔 Subscription Alert',
                    message: `Subscription is expiring in just ${isExpiredSoon.days} days. Don't miss out on renewing it!`,
                    owner_id: subscriptionOwner.owner_id,
                })
            }
        })
    } catch (error) {}
}

const checkRemainingStockItem = async () => {
    try {
        const limitedStockItems = await Variant.find({ stock: { $lte: 10 } })

        limitedStockItems.forEach(async (item) => {
            await Notification.addData({
                owner_id: item.owner_id,
                ref_link: `/variant/${item._id}`,
                title: '🔔 Stock Alert',
                message: `The stock for item ${item.name} is low, only ${item.stock} left. Please restock soon.`,
            })
        })
    } catch (error) {}
}

const proceedTopSellingItem = async () => {
    try {
        const { startDate } = utils.getPreviousDate()

        const saleInvoices = await SalesInvoice.find({
            created_at: { $gte: startDate.toDate() },
        })

        // Process the sale invoices in chunks
        for (let i = 0; i < saleInvoices.length; i += CHUNK_SIZE) {
            const chunkSaleInvoices = saleInvoices.slice(i, i + CHUNK_SIZE)

            for (const sale of chunkSaleInvoices) {
                for (const item of sale.order_items) {
                    await TopSelling.findOneAndUpdate(
                        {
                            item_id: item.item_id,
                            owner_id: sale.owner_id,
                            store_id: sale.store_id,
                        },
                        {
                            $inc: {
                                total_quantity: item.quantity,
                                subtotal_amount: item.subtotal_amount,
                                discount_amount: item.discount_amount,
                                tax_amount: item.tax_amount,
                                total_amount: item.total_amount,
                            },
                            $set: {
                                name: item.name,
                                barcode: item.barcode,
                                created_at: new Date(),
                                updated_at: new Date(),
                            },
                        },
                        { upsert: true, new: true }
                    )
                }
            }
        }
    } catch (error) {}
}

const proceedDailyLedger = async () => {
    try {
        const { startDate } = utils.getPreviousDate()
        const stores = await Store.find({})

        for (const store of stores) {
            const payables = await AccPayable.find({
                store_id: store._id,
                due_date: { $gte: startDate.toDate() },
            })

            const receivables = await AccReceivable.find({
                store_id: store._id,
                due_date: { $gte: startDate.toDate() },
            })

            let totalDebit = 0
            let totalCredit = 0
            const transactions = []

            for (const payable of payables) {
                totalDebit += payable.due_amount
                transactions.push({
                    invoice_id: payable.invoice_id,
                    invoice_type: 'purchase_invoice',
                    description: 'Payable due amount',
                    amount: payable.due_amount,
                    type: 'debit',
                })
            }

            for (const receivable of receivables) {
                totalCredit += receivable.due_amount
                transactions.push({
                    invoice_id: receivable.invoice_id,
                    invoice_type: 'sale_invoice',
                    description: 'Receivable due amount',
                    amount: receivable.due_amount,
                    type: 'credit',
                })
            }

            if (totalCredit || totalDebit) {
                await LedgerDaily.create({
                    owner_id: store.owner_id,
                    store_id: store._id,
                    transactions: transactions,
                    total_credit: totalCredit,
                    total_debit: totalDebit,
                    balance: totalCredit - totalDebit,
                    date: startDate.toDate(),
                })
            }
        }
    } catch (error) {}
}

// Run at 12:00 AM every day
cron.schedule('0 0 * * *', async () => {
    // await checkExpireSubscription()
})

// Run at 12:15 AM every day
cron.schedule('15 0 * * *', async () => {
    // await checkRemainingStockItem()
})

// Run at 12:30 AM every day
cron.schedule('30 0 * * *', async () => {
    // await proceedTopSellingItem()
})
// Run at 12:45 AM every day
cron.schedule('45 0 * * *', async () => {
    // await proceedDailyLedger()
})

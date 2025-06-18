const serialize = require('@controllers/serializer2')
const Variant = require('@models/mongodb/schemas/variant')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')
const RefundInvoice = require('@models/mongodb/schemas/sale-invoice')
const { isEmptyArray } = require('@utils/index')
const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { objectId } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.sale_refund

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    filter.state = 'refund'
    const recordsTotal = await RefundInvoice.countDocuments(filter)

    return RefundInvoice.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .then((data) => {
            return serialize({
                data,
                draw,
                recordsTotal,
                recordsFiltered: recordsTotal,
            })
        })
}

controller.findDataById = (id) => {
    return RefundInvoice.findById(id)
        .populate({
            path: 'staff_id',
            model: 'staff',
            select: 'name email description',
        })
        .populate({
            path: 'customer_id',
            model: 'customer',
            select: 'name address description',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return RefundInvoice.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return RefundInvoice.findByIdAndUpdate(dataObj.id, { state: 'refund' })
        .then(async (result) => {
            const newSaleInvoice = await recalculateInvoice(result, dataObj)
            if (isEmptyArray(newSaleInvoice.order_items)) return result
            return SalesInvoice.create(newSaleInvoice)
        })
        .then(async (updateInvoice) => {
            for (let refundItem of dataObj.order_items) {
                await Variant.updateOne(
                    { _id: objectId(refundItem.item_id) },
                    { $inc: { stock: parseInt(refundItem.quantity) } }
                )
            }
            return updateInvoice
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    return RefundInvoice.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return RefundInvoice.findByIdAndDelete(id).then(serialize)
    return RefundInvoice.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

// local function
async function recalculateInvoice(salesInvoice, refund) {
    let refundItems = controller.order_items
    let newInvoice = JSON.parse(JSON.stringify(salesInvoice))

    delete newInvoice._id
    delete newInvoice.__v
    delete newInvoice.invoice_no
    delete newInvoice.created_at
    delete newInvoice.updated_at

    for (let i = 0; i < refundItems.length; i++) {
        let refundItem = refundItems[i]
        let item_id = refundItem.item_id
        let refund_quantity = parseInt(refundItem.quantity)
        let retail_price = parseFloat(refundItem.retail_price)

        let itemIndex = newInvoice.order_items.findIndex((item) => item.item_id === item_id)

        if (itemIndex !== -1) {
            let orgItem = newInvoice.order_items[itemIndex]

            orgItem.quantity -= refund_quantity
            orgItem.subtotal_amount -= retail_price * refund_quantity
            orgItem.total_amount -= retail_price * refund_quantity
            orgItem.discount_amount -= (orgItem.discount_amount / orgItem.quantity) * refund_quantity
            orgItem.tax_amount -= (orgItem.tax_amount / orgItem.quantity) * refund_quantity

            if (orgItem.quantity <= 0) {
                newInvoice.order_items.splice(itemIndex, 1)
            }
        }
    }

    let newTax = 0
    let newDiscount = 0
    let newSubtotal = 0

    for (let i = 0; i < newInvoice.order_items.length; i++) {
        let item = newInvoice.order_items[i]
        newSubtotal += item.subtotal_amount
        newDiscount += item.discount_amount
        newTax += item.tax_amount
    }

    newInvoice.tax_amount = newTax
    newInvoice.discount_amount = newDiscount
    newInvoice.subtotal_amount = newSubtotal
    newInvoice.total_amount = newSubtotal - newDiscount + newTax
    newInvoice.invoice_no = await generateCode({ prefix: 'SAI', type: 'sale_invoice' })

    return newInvoice
}

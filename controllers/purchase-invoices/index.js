const serialize = require('@controllers/serializer2')
const Variant = require('@models/mongodb/schemas/variant')
const AccPayable = require('@models/mongodb/schemas/acc-payable')
const PurchaseInvoice = require('@models/mongodb/schemas/purchase-invoice')

const utils = require('@utils/index')
const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.purchase_invoice

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await PurchaseInvoice.countDocuments(filter)

    return PurchaseInvoice.find(filter)
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
    return PurchaseInvoice.findById(id)
        .populate({
            path: 'purchase_items.item_id',
            model: 'variant',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return PurchaseInvoice.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    let result
    dataObj.subtotal_amount = 0
    dataObj.total_amount = 0
    dataObj.invoice_no = await generateCode({ type: 'purchase_invoice', prefix: 'PUI' })
    dataObj.purchased_at = new Date(utils.convertDate(dataObj.purchased_at, dt_format.date_dmy, dt_format.full_24))

    const updateOps = []

    dataObj.purchase_items = dataObj.purchase_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount

        updateOps.push({
            updateOne: {
                filter: { _id: item.item_id },
                update: { $inc: { stock: Number(item.quantity) } },
            },
        })

        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return PurchaseInvoice.create(dataObj)
        .then((data) => {
            result = data
            return Variant.bulkWrite(updateOps)
        })
        .then((_data) => {
            const {
                _id: invoice_id,
                owner_id,
                store_id,
                supplier_id,
                total_amount: due_amount,
                created_at: due_date,
                state,
            } = result
            return AccPayable.create({
                owner_id,
                store_id,
                invoice_id,
                supplier_id,
                state,
                due_amount,
                due_date,
            })
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.subtotal_amount = 0
    dataObj.total_amount = 0
    dataObj.purchased_at = new Date(utils.convertDate(dataObj.purchased_at, dt_format.date_dmy, dt_format.full_24))
    dataObj.purchase_items = dataObj.purchase_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount
        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return PurchaseInvoice.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return PurchaseInvoice.findByIdAndDelete(id).then(serialize)
    return PurchaseInvoice.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

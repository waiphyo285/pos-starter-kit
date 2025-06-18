const serialize = require('@controllers/serializer2')
const Variant = require('@models/mongodb/schemas/variant')
const AdjustInvoice = require('@models/mongodb/schemas/adjustment-invoice')

const utils = require('@utils/index')
const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services, dt_format } = require('@config/constant')

const service = services.adjust_invoice

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await AdjustInvoice.countDocuments(filter)

    return AdjustInvoice.find(filter)
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
    return AdjustInvoice.findById(id)
        .populate({
            path: 'adjust_items.item_id',
            model: 'variant',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return AdjustInvoice.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    let result
    dataObj.subtotal_amount = 0
    dataObj.total_amount = 0
    dataObj.invoice_no = await generateCode({ type: 'adjust_invoice', prefix: 'AJT' })
    dataObj.adjusted_at = new Date(utils.convertDate(dataObj.adjusted_at, dt_format.date_dmy, dt_format.full_24))

    const updateOps = []

    dataObj.adjust_items = dataObj.adjust_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount

        updateOps.push({
            updateOne: {
                filter: { _id: item.item_id },
                update: {
                    $inc: { stock: item.type === 'Add' ? Number(item.quantity) : -Number(item.quantity) },
                },
            },
        })

        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return AdjustInvoice.create(dataObj)
        .then((data) => {
            result = data
            return Variant.bulkWrite(updateOps)
        })
        .then((_data) => result)
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.subtotal_amount = 0
    dataObj.total_amount = 0
    dataObj.adjusted_at = new Date(utils.convertDate(dataObj.adjusted_at, dt_format.date_dmy, dt_format.full_24))
    dataObj.adjust_items = dataObj.adjust_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount
        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return AdjustInvoice.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return AdjustInvoice.findByIdAndDelete(id).then(serialize)
    return AdjustInvoice.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

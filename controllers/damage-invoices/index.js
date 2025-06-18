const serialize = require('@controllers/serializer2')
const Variant = require('@models/mongodb/schemas/variant')
const DamageInvoice = require('@models/mongodb/schemas/damage-invoice')

const utils = require('@utils/index')
const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.damage_invoice

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await DamageInvoice.countDocuments(filter)

    return DamageInvoice.find(filter)
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
    return DamageInvoice.findById(id)
        .populate({
            path: 'damage_items.item_id',
            model: 'variant',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return DamageInvoice.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    let result
    dataObj.subtotal_amount = 0
    dataObj.total_amount = 0
    dataObj.invoice_no = await generateCode({ type: 'damage_invoice', prefix: 'DMG' })
    dataObj.damaged_at = new Date(utils.convertDate(dataObj.damaged_at, dt_format.date_dmy, dt_format.full_24))

    const updateOps = []

    dataObj.damage_items = dataObj.damage_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount

        updateOps.push({
            updateOne: {
                filter: { _id: item.item_id },
                update: { $inc: { stock: -Number(item.quantity) } },
            },
        })

        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return DamageInvoice.create(dataObj)
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
    dataObj.damaged_at = new Date(utils.convertDate(dataObj.damaged_at, dt_format.date_dmy, dt_format.full_24))
    dataObj.damage_items = dataObj.damage_items.map((item) => {
        item.subtotal_amount = Number(item.retail_price) * Number(item.quantity)
        dataObj.subtotal_amount += item.subtotal_amount
        return item
    })

    dataObj.total_amount = dataObj.subtotal_amount

    return DamageInvoice.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return DamageInvoice.findByIdAndDelete(id).then(serialize)
    return DamageInvoice.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

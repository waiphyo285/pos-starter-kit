const serialize = require('@controllers/serializer2')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.sale_invoice

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SalesInvoice.countDocuments(filter)

    return SalesInvoice.find(filter)
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
    return SalesInvoice.findById(id)
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
    return SalesInvoice.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return SalesInvoice.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return SalesInvoice.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return SalesInvoice.findByIdAndDelete(id).then(serialize)
    return SalesInvoice.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

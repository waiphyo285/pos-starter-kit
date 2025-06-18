const serialize = require('@controllers/serializer2')
const AccReceivable = require('@models/mongodb/schemas/acc-receivable')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.acc_receivable

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await AccReceivable.countDocuments(filter)

    return (
        AccReceivable.find(filter)
            // .or({
            //     $or: w_regx,
            // })
            .populate({
                path: 'invoice_id',
                model: 'sale_invoice',
                select: 'invoice_no',
            })
            .populate({
                path: 'customer_id',
                model: 'customer',
                select: 'name',
            })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean()
            .then((data) => {
                return serialize(
                    {
                        data,
                        draw,
                        recordsTotal,
                        recordsFiltered: recordsTotal,
                    },
                    service,
                    true
                )
            })
    )
}

controller.findDataById = (id) => {
    return AccReceivable.findById(id)
        .populate({
            path: 'invoice_id',
            model: 'sale_invoice',
            select: 'invoice_no',
        })
        .populate({
            path: 'customer_id',
            model: 'customer',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return AccReceivable.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    return AccReceivable.create(dataObj).serialize()
}

controller.updateData = (id, dataObj) => {
    return AccReceivable.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return AccReceivable.findByIdAndDelete(id).then(serialize)
    return AccReceivable.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

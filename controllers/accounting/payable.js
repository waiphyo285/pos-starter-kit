const serialize = require('@controllers/serializer2')
const AccPayable = require('@models/mongodb/schemas/acc-payable')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.acc_payable

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await AccPayable.countDocuments(filter)

    return (
        AccPayable.find(filter)
            // .or({
            //     $or: w_regx,
            // })
            .populate({
                path: 'invoice_id',
                model: 'purchase_invoice',
                select: 'invoice_no',
            })
            .populate({
                path: 'supplier_id',
                model: 'supplier',
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
    return AccPayable.findById(id)
        .populate({
            path: 'invoice_id',
            model: 'purchase_invoice',
            select: 'invoice_no',
        })
        .populate({
            path: 'supplier_id',
            model: 'supplier',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return AccPayable.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    return AccPayable.create(dataObj).serialize()
}

controller.updateData = (id, dataObj) => {
    return AccPayable.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return AccPayable.findByIdAndDelete(id).then(serialize)
    return AccPayable.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

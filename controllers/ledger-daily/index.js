const serialize = require('../serializer2')
const LedgerDaily = require('@models/mongodb/schemas/ledger-daily')

const utils = require('@utils/index')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.ledger_daily

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await LedgerDaily.countDocuments(filter)

    return (
        LedgerDaily.find(filter)
            // .or({
            //     $or: w_regx,
            // })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'owner_id',
                model: 'owner',
                select: 'name',
            })
            .populate({
                path: 'store_id',
                model: 'store',
                select: 'name',
            })
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
    return LedgerDaily.findById(id)
        .populate({
            path: 'owner_id',
            model: 'owner',
            select: 'name',
        })
        .populate({
            path: 'store_id',
            model: 'store',
            select: 'name',
        })
        .lean()
        .then((data) => {
            return serialize(data, service, true)
        })
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return LedgerDaily.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    dataObj.date = new Date(utils.convertDate(dataObj.date, dt_format.date_dmy, dt_format.full_24))
    return LedgerDaily.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.date = new Date(utils.convertDate(dataObj.date, dt_format.date_dmy, dt_format.full_24))
    return LedgerDaily.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

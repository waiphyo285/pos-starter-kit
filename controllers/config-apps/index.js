const serialize = require('../serializer2')
const ConfigApp = require('@models/mongodb/schemas/config-app')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.app_config

const controller = (module.exports = {})
controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await ConfigApp.countDocuments(filter)

    return ConfigApp.find(filter)
        .or({
            $or: w_regx,
        })
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
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)

    return ConfigApp.find(filter)
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

controller.indDataById = (id) => {
    return ConfigApp.findById(id).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return ConfigApp.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return ConfigApp.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    // return ConfigApp.findByIdAndDelete(id).lean().then(serialize)
    return ConfigApp.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

const serialize = require('../serializer2')
const Notification = require('@models/mongodb/schemas/notification')

const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.notification

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['title']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Notification.countDocuments(filter)

    return Notification.find(filter)
        .or({
            $or: w_regx,
        })
        .populate({
            path: 'store_id',
            model: 'store',
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
}

controller.findDataById = (id) => {
    return Notification.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Notification.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return Notification.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Notification.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

controller.dropAllBy = (filter) => {
    return Notification.deleteMany(filter)
        .then((result) => {
            return result
        })
        .catch((error) => {
            throw error
        })
}

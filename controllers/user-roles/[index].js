const async = require('async')
const serialize = require('../serializer')
const UserRole = require('@models/mongodb/schemas/user-role')
const { clearKey } = require('@models/cache/services/index')

const utils = require('@utils/index')
const { checkReference } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const collectionName = UserRole.collection.collectionName

const controller = (module.exports = {})

controller.listData = async (params) => {
    const filter = {}

    if (params.created_at) {
        filter['created_at'] = await utils.getDateRange(params.created_at)
    }

    return UserRole.find(filter).cache().then(serialize)
}

controller.findDataById = (id) => {
    return UserRole.findById(id)
        .lean()
        .then((res) => {
            clearKey(collectionName)
            return res
        })
        .then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)

    return UserRole.find(filter)
        .then((res) => {
            clearKey(collectionName)
            return res
        })
        .then(serialize)
}

controller.addData = (dataObj) => {
    return UserRole.create(dataObj)
        .then((res) => {
            clearKey(collectionName)
            return res
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    return UserRole.findByIdAndUpdate(id, dataObj)
        .then((res) => {
            clearKey(collectionName)
            return res
        })
        .then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'user',
                key: 'level_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    return UserRole.findByIdAndDelete(id)
        .then((res) => {
            clearKey(collectionName)
            return res
        })
        .then(serialize)
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

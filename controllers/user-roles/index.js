const async = require('async')
const serialize = require('../serializer')
const UserRole = require('@models/mongodb/schemas/user-role')

const utils = require('@utils/index')
const { checkReference } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    const filter = {}

    if (params.n_filter) {
        filter['owner_id'] = params.n_filter.owner_id
    }

    if (params.created_at) {
        filter['created_at'] = await utils.getDateRange(params.created_at)
    }

    return UserRole.find(filter).then(serialize)
}

controller.findDataById = (id) => {
    return UserRole.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return UserRole.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return UserRole.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return UserRole.findByIdAndUpdate(id, dataObj).then(serialize)
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

    // return UserRole.findByIdAndDelete(id).then(serialize)
    return UserRole.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

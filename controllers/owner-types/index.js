const async = require('async')
const serialize = require('../serializer')
const OwnerType = require('@models/mongodb/schemas/owner-type')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await OwnerType.countDocuments(filter)

    return OwnerType.find(filter)
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
    return OwnerType.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return OwnerType.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return OwnerType.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return OwnerType.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'owner',
                key: 'owner_type_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return OwnerType.findByIdAndDelete(id).then(serialize)
    return OwnerType.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

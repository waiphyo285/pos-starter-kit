const async = require('async')
const serialize = require('../serializer2')
const StoreType = require('@models/mongodb/schemas/store-type')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.store_type

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await StoreType.countDocuments(filter)

    return StoreType.find(filter)
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
    return StoreType.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return StoreType.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return StoreType.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return StoreType.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'store',
                key: 'store_type_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return StoreType.findByIdAndDelete(id).lean().then(serialize)
    return StoreType.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

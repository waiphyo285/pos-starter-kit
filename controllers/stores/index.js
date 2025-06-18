const async = require('async')
const serialize = require('../serializer2')
const Store = require('@models/mongodb/schemas/store')
const StoreSetting = require('@models/mongodb/schemas/store-setting')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.store

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Store.countDocuments(filter)

    return Store.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'store_type_id',
            model: 'store_type',
            select: 'name',
        })
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
    return Store.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Store.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return Store.create(dataObj)
        .then((data) => {
            const settingObj = {
                owner_id: data.owner_id,
                store_id: data._id,
                name: data.name,
                status: true,
            }
            return StoreSetting.create(settingObj)
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Store.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'account',
                key: 'store_id',
                value: id,
            },
            {
                name: 'staff',
                key: 'store_id',
                value: id,
            },
            {
                name: 'supplier',
                key: 'store_id',
                value: id,
            },
            {
                name: 'customer',
                key: 'store_id',
                value: id,
            },
            {
                name: 'product',
                key: 'store_id',
                value: id,
            },
            {
                name: 'variant',
                key: 'store_id',
                value: id,
            },
            {
                name: 'sale_order',
                key: 'store_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return Store.findByIdAndDelete(id).lean().then(serialize)
    return Store.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

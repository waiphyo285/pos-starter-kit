const async = require('async')
const serialize = require('../serializer2')
const Township = require('@models/mongodb/schemas/township')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.township

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['township_mm']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Township.countDocuments(filter)

    return Township.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'cityid',
            model: 'city',
            select: 'city_mm',
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
    return Township.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Township.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return Township.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Township.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'store',
                key: 'township_id',
                value: id,
            },
            {
                name: 'owner',
                key: 'township_id',
                value: id,
            },
            {
                name: 'staff',
                key: 'township_id',
                value: id,
            },
            {
                name: 'supplier',
                key: 'township_id',
                value: id,
            },
            {
                name: 'customer',
                key: 'township_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return Township.findByIdAndDelete(id).lean().then(serialize)
    return Township.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

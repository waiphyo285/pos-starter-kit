const async = require('async')
const serialize = require('../serializer2')
const Customer = require('@models/mongodb/schemas/customer')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.customer

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Customer.countDocuments(filter)

    return Customer.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'customer_type_id',
            model: 'customer_type',
            select: 'name',
        })
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

controller.findDataById = (id) => {
    return Customer.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { sort, filter, skip, limit } = await getPaginationQuery(params)

    const recordsTotal = await Customer.countDocuments(filter)

    return Customer.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .then((data) => {
            return serialize({
                data,
                recordsTotal,
                recordsFiltered: recordsTotal,
            })
        })
}

controller.addData = (dataObj) => {
    return Customer.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Customer.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'account',
                key: 'customer_id',
                value: id,
            },
            {
                name: 'sale_order',
                key: 'customer_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0)
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })

    // return Customer.findByIdAndDelete(id).lean().then(serialize)
    return Customer.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

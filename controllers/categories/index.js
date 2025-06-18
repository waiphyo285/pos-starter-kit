const async = require('async')

const serialize = require('../serializer2')
const Category = require('@models/mongodb/schemas/category')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const { services } = require('@config/constant')

const service = services.category

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Category.countDocuments(filter)

    return Category.find(filter)
        .or({ $or: w_regx })
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
    return Category.findById(id).lean().then(serialize)
}

controller.findDataByCode = (codes) => {
    return Category.find({ name: { $in: codes } })
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Category.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return Category.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Category.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'sub_category',
                key: 'category_id',
                value: id,
            },
            {
                name: 'product',
                key: 'category_id',
                value: id,
            },
            {
                name: 'variant',
                key: 'category_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return Category.findByIdAndDelete(id).then(serialize)
    return Category.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

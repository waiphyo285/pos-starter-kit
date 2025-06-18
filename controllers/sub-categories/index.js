const async = require('async')
const serialize = require('../serializer2')
const SubCategory = require('@models/mongodb/schemas/sub-category')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.sub_category

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SubCategory.countDocuments(filter)

    return SubCategory.find(filter)
        .or({ $or: w_regx })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'owner_id',
            model: 'owner',
            select: 'name',
        })
        .populate({
            path: 'category_id',
            model: 'category',
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
    return SubCategory.findById(id).lean().then(serialize)
}

controller.findDataByCode = (codes) => {
    return SubCategory.find({ name: { $in: codes } })
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return SubCategory.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return SubCategory.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return SubCategory.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'product',
                key: 'sub_category_id',
                value: id,
            },
            {
                name: 'variant',
                key: 'sub_category_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return SubCategory.findByIdAndDelete(id).lean().then(serialize)
    return SubCategory.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

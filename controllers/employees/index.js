const async = require('async')
const serialize = require('../serializer2')
const Employee = require('@models/mongodb/schemas/employee')

const { services } = require('@config/constant')
const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const service = services.employee

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Employee.countDocuments(filter)

    return Employee.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'staff_type_id',
            model: 'staff_type',
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
    return Employee.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Employee.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return Employee.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Employee.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'account',
                key: 'staff_id',
                value: id,
            },
            {
                name: 'sale_order',
                key: 'staff_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return Employee.findByIdAndDelete(id).lean().then(serialize)
    return Employee.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

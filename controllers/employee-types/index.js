const async = require('async')
const serialize = require('../serializer2')
const EmployeeType = require('@models/mongodb/schemas/employee-type')

const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.employee_type

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await EmployeeType.countDocuments(filter)

    return EmployeeType.find(filter)
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
    return EmployeeType.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return EmployeeType.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return EmployeeType.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return EmployeeType.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'staff',
                key: 'staff_type_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0)
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })

    // return EmployeeType.findByIdAndDelete(id).lean().then(serialize)
    return EmployeeType.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

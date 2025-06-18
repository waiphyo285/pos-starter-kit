const serialize = require('../serializer')
const Currency = require('@models/mongodb/schemas/currency')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Currency.countDocuments(filter)

    return Currency.find(filter)
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
    return Currency.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Currency.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    return Currency.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Currency.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return Currency.findByIdAndDelete(id).then(serialize)
    return Currency.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

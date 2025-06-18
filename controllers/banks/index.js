const serialize = require('../serializer')
const Bank = require('@models/mongodb/schemas/bank')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Bank.countDocuments(filter)

    return Bank.find(filter)
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
    return Bank.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params, false)

    return Bank.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return Bank.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Bank.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return Bank.findByIdAndDelete(id).then(serialize)
    return Bank.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

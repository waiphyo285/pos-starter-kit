const serialize = require('../serializer')
const Model = require('@models/mongodb/schemas/generator')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Model.countDocuments(filter)

    return Model.find(filter)
        .or({ $or: w_regx })
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
    return Model.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Model.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return Model.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Model.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return Model.findByIdAndDelete(id).then(serialize)
    return Model.deleteById(id).then(serialize)
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

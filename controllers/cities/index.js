const serialize = require('../serializer')
const City = require('@models/mongodb/schemas/city')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['city_mm']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await City.countDocuments(filter)

    return City.find(filter)
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
    return City.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return City.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return City.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return City.findByIdAndUpdate(id, dataObj).then(serialize)
}

// eslint-disable-next-line no-unused-vars
controller.deleteData = (id) => {
    // return City.findByIdAndDelete(id).then(serialize)
    return City.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

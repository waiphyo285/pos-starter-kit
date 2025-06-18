const serialize = require('../serializer')
const Information = require('@models/mongodb/schemas/information')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Information.countDocuments(filter)

    return Information.find(filter)
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
    return Information.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Information.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return Information.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Information.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return Information.findByIdAndDelete(id).then(serialize)
    return Information.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

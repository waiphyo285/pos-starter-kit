const serialize = require('../serializer')
const SaleHolding = require('@models/mongodb/schemas/sale-holding')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SaleHolding.countDocuments(filter)

    return SaleHolding.find(filter)
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
    return SaleHolding.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return SaleHolding.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    return SaleHolding.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return SaleHolding.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return SaleHolding.deleteById(id).then(serialize) // softdelete
    return SaleHolding.findByIdAndDelete(id).then(serialize) // harddelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

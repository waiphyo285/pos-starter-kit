const serialize = require('../serializer')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')
const SubscriptionPlan = require('@models/mongodb/schemas/subscription-plan')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['plan_type']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SubscriptionPlan.countDocuments(filter)

    return SubscriptionPlan.find(filter)
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
    return SubscriptionPlan.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return SubscriptionPlan.find(filter).then(serialize)
}

controller.addData = (dataObj) => {
    return SubscriptionPlan.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return SubscriptionPlan.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return SubscriptionPlan.findByIdAndDelete(id).then(serialize)
    return SubscriptionPlan.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

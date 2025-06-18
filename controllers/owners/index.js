const utils = require('@utils/index')
const serialize = require('../serializer2')
const Owner = require('@models/mongodb/schemas/owner')
const Setting = require('@models/mongodb/schemas/setting')
const SubscriptionOwner = require('@models/mongodb/schemas/subscription-owner')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.owner

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    if (params.n_filter && params.n_filter['owner_id']) {
        filter['_id'] = params.n_filter['owner_id']
    }

    const recordsTotal = await Owner.countDocuments(filter)

    return Owner.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'owner_type_id',
            model: 'owner_type',
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
    let result = {}
    return Owner.findById(id)
        .lean()
        .then((res) => {
            result = res
            return SubscriptionOwner.findOne({
                owner_id: id,
            })
        })
        .then((subscriptionResp) => {
            if (subscriptionResp) {
                return {
                    ...result,
                    plan_id: subscriptionResp.plan_id,
                    plan_owner_id: subscriptionResp._id,
                    plan_status: subscriptionResp.status,
                    plan_description: subscriptionResp.description,
                    started_at: utils.convertDate(subscriptionResp.started_at),
                    expired_at: utils.convertDate(subscriptionResp.expired_at),
                }
            }
            return result
        })
        .then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params, false)

    if (params.n_filter && params.n_filter['owner_id']) {
        filter['_id'] = params.n_filter['owner_id']
    }

    return Owner.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    let result = {}
    return Owner.create(dataObj)
        .then((res) => {
            result = res
            return Setting.create({
                owner_id: res._id,
            })
        })
        .then((settingRes) => {
            return result
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    let result = {}
    return Owner.findByIdAndUpdate(id, dataObj)
        .lean()
        .then(async (res) => {
            result = res
            const setting = await Setting.findOne({
                owner_id: res._id,
            })

            if (!setting) {
                return Setting.create({
                    owner_id: res._id,
                })
            }
            return result
        })
        .then((settingRes) => {
            return result
        })
        .then(serialize)
}

// eslint-disable-next-line no-unused-vars
controller.deleteData = (id) => {
    // return Owner.findByIdAndDelete(id).then(serialize)
    return Owner.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

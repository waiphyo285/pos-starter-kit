const sUtils = require('@utils/subscription')
const serialize = require('../serializer')
const Notification = require('../notifications')
const SubscriptionPlan = require('@models/mongodb/schemas/subscription-plan')
const SubscriptionOwner = require('@models/mongodb/schemas/subscription-owner')
const { getServerSideQuery, getPaginationQuery } = require('@utils/schema')

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['description']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SubscriptionOwner.countDocuments(filter)

    return SubscriptionOwner.find(filter)
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
    return SubscriptionOwner.findById(id).then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return SubscriptionOwner.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    const planId = dataObj.plan_id

    return await SubscriptionPlan.findById(planId)
        .select('duration')
        .lean()
        .then((subPlanRes) => {
            const dateRangeOptions = { isRenew: false }
            const { startDate, endDate } = sUtils.getDateRangeByDuration(subPlanRes.duration, dateRangeOptions)
            return SubscriptionOwner.create({
                ...dataObj,
                started_at: new Date(startDate),
                expired_at: new Date(endDate),
            })
        })
        .then(serialize)
}

controller.updateData = async (id, dataObj) => {
    if (dataObj.is_renew == 1) {
        let result = {}
        const planId = dataObj.plan_id

        return SubscriptionPlan.findById(planId)
            .select('duration')
            .lean()
            .then((subPlanRes) => {
                const dateRangeOptions = {
                    isRenew: true,
                    endedAt: dataObj.expired_at,
                }
                const { endDate } = sUtils.getDateRangeByDuration(subPlanRes.duration, dateRangeOptions)
                return SubscriptionOwner.findByIdAndUpdate(id, { ...dataObj, expired_at: new Date(endDate) })
            })
            .then((subOwnerRes) => {
                result = subOwnerRes
                return Notification.dropAllBy({
                    owner_id: dataObj.owner_id,
                })
            })
            .then((delNotiRes) => {
                return Notification.addData({
                    title: '🎉 Subscription Renewed',
                    message: 'Your subscription has been successfully renewed!',
                    owner_id: dataObj.owner_id,
                })
            })
            .then((newNotiRes) => {
                return result
            })
            .then(serialize)
    }

    const newDataObj = {
        status: dataObj.status,
        description: dataObj.description,
    }

    return SubscriptionOwner.findByIdAndUpdate(id, newDataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return SubscriptionOwner.findByIdAndDelete(id).then(serialize)
    return SubscriptionOwner.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

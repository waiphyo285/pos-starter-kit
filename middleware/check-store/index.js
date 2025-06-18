const utils = require('@utils/index')
const Store = require('@models/mongodb/schemas/store')
const SubscriptionOwner = require('@models/mongodb/schemas/subscription-owner')
const { createResponse } = require('@utils/handlers/response')

const prev = (data, locales, res) => {
    res.status(422).json(createResponse(422, { data }, locales))
}

const checkStoreToCreate = async (req, res, next) => {
    const accObj = req.query.n_filter
    const locales = res.locals.i18n.translations

    const storeCount = await Store.count({ owner_id: accObj.owner_id })
    const subscriptionOwner = await SubscriptionOwner.findOne({ owner_id: accObj.owner_id }).populate({
        path: 'plan_id',
        model: 'subscription_plan',
        select: 'plan_type max_store',
    })

    if (!utils.isEmpty(subscriptionOwner)) {
        const { plan_id: plan } = subscriptionOwner
        return storeCount >= plan.max_store ? prev({ message: 'You reach maximum store size' }, locales, res) : next()
    }

    return prev({ message: 'Unable to proceed your request' }, locales, res)
}

module.exports = {
    checkStoreToCreate,
}

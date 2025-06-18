const utils = require('@utils/index')
const programConfig = require('@config/program/config.json')
const SubscriptionPlan = require('@controllers/subscription-plans')
const { createResponse, handleDatabase, handleError } = require('@utils/handlers/response')

const subscriptionPlan = (module.exports = {})

subscriptionPlan.config = (req, res, next) => {
    try {
        const filterPlan = programConfig.planList
        const data = JSON.parse(JSON.stringify(filterPlan))
        const locales = res.locals.i18n.translations
        res.status(200).json(createResponse(200, { data: { data } }, locales))
    } catch (err) {
        res.status(500).json(handleError(err, locales))
    }
}

subscriptionPlan.index = (req, res, next) => {
    const getService = SubscriptionPlan.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.show = (req, res, next) => {
    const getService = SubscriptionPlan.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.showBy = (req, res, next) => {
    const getService = SubscriptionPlan.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.create = (req, res, next) => {
    const getService = SubscriptionPlan.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.update = (req, res, next) => {
    const getService = SubscriptionPlan.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.delete = (req, res, next) => {
    const getService = SubscriptionPlan.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionPlan.deleteAll = (req, res, next) => {
    SubscriptionPlan.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

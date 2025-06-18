const utils = require('@utils/index')
const { handleDatabase } = require('@utils/handlers/response')
const SubscriptionOwner = require('@controllers/subscription-owners')

const subscriptionOwner = (module.exports = {})

subscriptionOwner.index = (req, res, next) => {
    const getService = SubscriptionOwner.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.show = (req, res, next) => {
    const getService = SubscriptionOwner.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.showBy = (req, res, next) => {
    const getService = SubscriptionOwner.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.create = (req, res, next) => {
    const getService = SubscriptionOwner.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.update = (req, res, next) => {
    const getService = SubscriptionOwner.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.delete = (req, res, next) => {
    const getService = SubscriptionOwner.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subscriptionOwner.deleteAll = (req, res, next) => {
    SubscriptionOwner.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

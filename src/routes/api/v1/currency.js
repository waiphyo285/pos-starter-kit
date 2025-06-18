const utils = require('@utils/index')
const Currency = require('@controllers/currencies')
const { handleDatabase } = require('@utils/handlers/response')

const currency = (module.exports = {})

currency.index = (req, res, next) => {
    const getService = Currency.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.show = (req, res, next) => {
    const getService = Currency.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.showBy = (req, res, next) => {
    const getService = Currency.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.create = (req, res, next) => {
    const getService = Currency.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.update = (req, res, next) => {
    const getService = Currency.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.delete = (req, res, next) => {
    const getService = Currency.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

currency.deleteAll = (req, res, next) => {
    Currency.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

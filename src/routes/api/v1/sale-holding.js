const utils = require('@utils/index')
const SaleHolding = require('@controllers/sale-holdings')
const { handleDatabase } = require('@utils/handlers/response')

const saleHolding = (module.exports = {})

saleHolding.index = (req, res, next) => {
    const getService = SaleHolding.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.show = (req, res, next) => {
    const getService = SaleHolding.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.showBy = (req, res, next) => {
    const getService = SaleHolding.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.create = (req, res, next) => {
    const getService = SaleHolding.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.update = (req, res, next) => {
    const getService = SaleHolding.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.delete = (req, res, next) => {
    const getService = SaleHolding.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleHolding.deleteAll = (req, res, next) => {
    SaleHolding.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

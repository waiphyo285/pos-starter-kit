const utils = require('@utils/index')
const SaleOrder = require('@controllers/sale-orders')
const { handleDatabase } = require('@utils/handlers/response')

const saleOrder = (module.exports = {})

saleOrder.index = (req, res, next) => {
    const getService = SaleOrder.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.show = (req, res, next) => {
    const getService = SaleOrder.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.showBy = (req, res, next) => {
    const getService = SaleOrder.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.create = (req, res, next) => {
    const getService = SaleOrder.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.update = (req, res, next) => {
    const getService = SaleOrder.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.makePayment = (req, res, next) => {
    const getService = SaleOrder.makePayment(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.delete = (req, res, next) => {
    const getService = SaleOrder.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

saleOrder.deleteAll = (req, res, next) => {
    SaleOrder.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

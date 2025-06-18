const utils = require('@utils/index')
const Customer = require('@controllers/customers')
const { handleDatabase } = require('@utils/handlers/response')

const customer = (module.exports = {})

customer.index = (req, res, next) => {
    const getService = Customer.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.show = (req, res, next) => {
    const getService = Customer.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.showBy = (req, res, next) => {
    const getService = Customer.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.create = (req, res, next) => {
    const getService = Customer.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.update = (req, res, next) => {
    const getService = Customer.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.delete = (req, res, next) => {
    const getService = Customer.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customer.deleteAll = (req, res, next) => {
    Customer.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

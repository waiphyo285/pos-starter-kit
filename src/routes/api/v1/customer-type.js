const utils = require('@utils/index')
const CustomerType = require('@controllers/customer-types')
const { handleDatabase } = require('@utils/handlers/response')

const customerType = (module.exports = {})

customerType.index = (req, res, next) => {
    const getService = CustomerType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.show = (req, res, next) => {
    const getService = CustomerType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.showBy = (req, res, next) => {
    const getService = CustomerType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.create = (req, res, next) => {
    const getService = CustomerType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.update = (req, res, next) => {
    const getService = CustomerType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.delete = (req, res, next) => {
    const getService = CustomerType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

customerType.deleteAll = (req, res, next) => {
    CustomerType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

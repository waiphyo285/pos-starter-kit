const utils = require('@utils/index')
const Supplier = require('@controllers/suppliers')
const { handleDatabase } = require('@utils/handlers/response')

const supplier = (module.exports = {})

supplier.index = (req, res, next) => {
    const getService = Supplier.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.show = (req, res, next) => {
    const getService = Supplier.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.showBy = (req, res, next) => {
    const getService = Supplier.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.create = (req, res, next) => {
    const getService = Supplier.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.update = (req, res, next) => {
    const getService = Supplier.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.delete = (req, res, next) => {
    const getService = Supplier.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplier.deleteAll = (req, res, next) => {
    Supplier.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const SupplierType = require('@controllers/supplier-types')
const { handleDatabase } = require('@utils/handlers/response')

const supplierType = (module.exports = {})

supplierType.index = (req, res, next) => {
    const getService = SupplierType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.show = (req, res, next) => {
    const getService = SupplierType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.showBy = (req, res, next) => {
    const getService = SupplierType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.create = (req, res, next) => {
    const getService = SupplierType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.update = (req, res, next) => {
    const getService = SupplierType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.delete = (req, res, next) => {
    const getService = SupplierType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

supplierType.deleteAll = (req, res, next) => {
    SupplierType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

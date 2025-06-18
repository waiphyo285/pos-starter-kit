const utils = require('@utils/index')
const Product = require('@controllers/products')
const { handleDatabase } = require('@utils/handlers/response')

const product = (module.exports = {})

product.index = (req, res, next) => {
    const getService = Product.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.show = (req, res, next) => {
    const getService = Product.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.showBy = (req, res, next) => {
    const getService = Product.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.create = (req, res, next) => {
    const getService = Product.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.update = (req, res, next) => {
    const getService = Product.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.delete = (req, res, next) => {
    const getService = Product.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

product.deleteAll = (req, res, next) => {
    Product.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

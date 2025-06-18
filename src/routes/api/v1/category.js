const utils = require('@utils/index')
const Category = require('@controllers/categories')
const { handleDatabase } = require('@utils/handlers/response')

const category = (module.exports = {})

category.index = (req, res, next) => {
    const getService = Category.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.show = (req, res, next) => {
    const getService = Category.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.showBy = (req, res, next) => {
    const getService = Category.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.create = (req, res, next) => {
    const getService = Category.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.update = (req, res, next) => {
    const getService = Category.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.delete = (req, res, next) => {
    const getService = Category.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

category.deleteAll = (req, res, next) => {
    Category.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

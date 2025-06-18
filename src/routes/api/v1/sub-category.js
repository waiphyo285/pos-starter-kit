const utils = require('@utils/index')
const SubCategory = require('@controllers/sub-categories')
const { handleDatabase } = require('@utils/handlers/response')

const subCategory = (module.exports = {})

subCategory.index = (req, res, next) => {
    const getService = SubCategory.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.show = (req, res, next) => {
    const getService = SubCategory.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.showBy = (req, res, next) => {
    const getService = SubCategory.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.create = (req, res, next) => {
    const getService = SubCategory.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.update = (req, res, next) => {
    const getService = SubCategory.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.delete = (req, res, next) => {
    const getService = SubCategory.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

subCategory.deleteAll = (req, res, next) => {
    SubCategory.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const Variant = require('@controllers/variants')
const { handleDatabase } = require('@utils/handlers/response')

const variant = (module.exports = {})

variant.index = (req, res, next) => {
    const getService = Variant.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.show = (req, res, next) => {
    const getService = Variant.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.showBy = (req, res, next) => {
    const getService = Variant.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.create = (req, res, next) => {
    const getService = Variant.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.update = (req, res, next) => {
    const getService = Variant.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.delete = (req, res, next) => {
    const getService = Variant.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

variant.deleteAll = (req, res, next) => {
    Variant.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

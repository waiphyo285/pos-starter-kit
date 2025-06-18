const utils = require('@utils/index')
const StoreType = require('@controllers/store-types')
const { handleDatabase } = require('@utils/handlers/response')

const storeType = (module.exports = {})

storeType.index = (req, res, next) => {
    const getService = StoreType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.show = (req, res, next) => {
    const getService = StoreType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.showBy = (req, res, next) => {
    const getService = StoreType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.create = (req, res, next) => {
    const getService = StoreType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.update = (req, res, next) => {
    const getService = StoreType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.delete = (req, res, next) => {
    const getService = StoreType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeType.deleteAll = (req, res, next) => {
    StoreType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

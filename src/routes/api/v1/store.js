const utils = require('@utils/index')
const Store = require('@controllers/stores')
const { handleDatabase } = require('@utils/handlers/response')

const store = (module.exports = {})

store.index = (req, res, next) => {
    const getService = Store.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.show = (req, res, next) => {
    const getService = Store.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.showBy = (req, res, next) => {
    const getService = Store.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.create = (req, res, next) => {
    const getService = Store.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.update = (req, res, next) => {
    const getService = Store.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.delete = (req, res, next) => {
    const getService = Store.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

store.deleteAll = (req, res, next) => {
    Store.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

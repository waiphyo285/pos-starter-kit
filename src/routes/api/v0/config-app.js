const utils = require('@utils/index')
const ConfigApp = require('@controllers/config-apps')
const { handleDatabase } = require('@utils/handlers/response')

const configApp = (module.exports = {})

configApp.index = (req, res, next) => {
    const getService = ConfigApp.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.show = (req, res, next) => {
    const getService = ConfigApp.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.showBy = (req, res, next) => {
    const getService = ConfigApp.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.create = (req, res, next) => {
    const getService = ConfigApp.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.update = (req, res, next) => {
    const getService = ConfigApp.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.delete = (req, res, next) => {
    const getService = ConfigApp.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

configApp.deleteAll = (req, res, next) => {
    ConfigApp.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

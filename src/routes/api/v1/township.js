const utils = require('@utils/index')
const Township = require('@controllers/townships')
const { handleDatabase } = require('@utils/handlers/response')

const township = (module.exports = {})

township.index = (req, res, next) => {
    const getService = Township.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.show = (req, res, next) => {
    const getService = Township.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.showBy = (req, res, next) => {
    const getService = Township.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.create = (req, res, next) => {
    const getService = Township.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.update = (req, res, next) => {
    const getService = Township.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.delete = (req, res, next) => {
    const getService = Township.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

township.deleteAll = (req, res, next) => {
    Township.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const Information = require('@controllers/information')
const { handleDatabase } = require('@utils/handlers/response')

const information = (module.exports = {})

information.index = (req, res, next) => {
    const getService = Information.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.show = (req, res, next) => {
    const getService = Information.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.showBy = (req, res, next) => {
    const getService = Information.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.create = (req, res, next) => {
    const getService = Information.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.update = (req, res, next) => {
    const getService = Information.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.delete = (req, res, next) => {
    const getService = Information.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

information.deleteAll = (req, res, next) => {
    Information.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const StoreSetting = require('@controllers/store-settings')
const { handleDatabase } = require('@utils/handlers/response')

const storeSetting = (module.exports = {})

storeSetting.index = (req, res, next) => {
    const getService = StoreSetting.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.show = (req, res, next) => {
    const getService = StoreSetting.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.showBy = (req, res, next) => {
    const getService = StoreSetting.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.create = (req, res, next) => {
    const getService = StoreSetting.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.update = (req, res, next) => {
    const getService = StoreSetting.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.delete = (req, res, next) => {
    const getService = StoreSetting.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

storeSetting.deleteAll = (req, res, next) => {
    StoreSetting.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

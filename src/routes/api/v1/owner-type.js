const utils = require('@utils/index')
const OwnerType = require('@controllers/owner-types')
const { handleDatabase } = require('@utils/handlers/response')

const ownerType = (module.exports = {})

ownerType.index = (req, res, next) => {
    const getService = OwnerType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.show = (req, res, next) => {
    const getService = OwnerType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.showBy = (req, res, next) => {
    const getService = OwnerType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.create = (req, res, next) => {
    const getService = OwnerType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.update = (req, res, next) => {
    const getService = OwnerType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.delete = (req, res, next) => {
    const getService = OwnerType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ownerType.deleteAll = (req, res, next) => {
    OwnerType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const DamageType = require('@controllers/damage-types')
const { handleDatabase } = require('@utils/handlers/response')

const damageType = (module.exports = {})

damageType.index = (req, res, next) => {
    const getService = DamageType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.show = (req, res, next) => {
    const getService = DamageType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.showBy = (req, res, next) => {
    const getService = DamageType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.create = (req, res, next) => {
    const getService = DamageType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.update = (req, res, next) => {
    const getService = DamageType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.delete = (req, res, next) => {
    const getService = DamageType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

damageType.deleteAll = (req, res, next) => {
    DamageType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

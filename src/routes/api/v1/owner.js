const utils = require('@utils/index')
const Owner = require('@controllers/owners')
const { handleDatabase } = require('@utils/handlers/response')

const owner = (module.exports = {})

owner.index = (req, res, next) => {
    const getService = Owner.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.show = (req, res, next) => {
    const getService = Owner.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.showBy = (req, res, next) => {
    const getService = Owner.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.create = (req, res, next) => {
    const getService = Owner.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.update = (req, res, next) => {
    const getService = Owner.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.delete = (req, res, next) => {
    const getService = Owner.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

owner.deleteAll = (req, res, next) => {
    Owner.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

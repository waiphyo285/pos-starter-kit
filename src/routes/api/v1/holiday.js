const utils = require('@utils/index')
const Holiday = require('@controllers/holidays')
const { handleDatabase } = require('@utils/handlers/response')

const holiday = (module.exports = {})

holiday.index = (req, res, next) => {
    const getService = Holiday.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.show = (req, res, next) => {
    const getService = Holiday.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.showBy = (req, res, next) => {
    const getService = Holiday.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.create = (req, res, next) => {
    const getService = Holiday.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.update = (req, res, next) => {
    const getService = Holiday.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.delete = (req, res, next) => {
    const getService = Holiday.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

holiday.deleteAll = (req, res, next) => {
    Holiday.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

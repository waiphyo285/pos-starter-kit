const utils = require('@utils/index')
const Notification = require('@controllers/notifications')
const { handleDatabase } = require('@utils/handlers/response')

const notification = (module.exports = {})

notification.index = (req, res, next) => {
    const getService = Notification.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.show = (req, res, next) => {
    const getService = Notification.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.showBy = (req, res, next) => {
    const getService = Notification.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.create = (req, res, next) => {
    const getService = Notification.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.update = (req, res, next) => {
    const getService = Notification.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.delete = (req, res, next) => {
    const getService = Notification.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

notification.deleteAll = (req, res, next) => {
    Notification.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

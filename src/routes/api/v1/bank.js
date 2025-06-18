const utils = require('@utils/index')
const Bank = require('@controllers/banks')
const { handleDatabase } = require('@utils/handlers/response')

const bank = (module.exports = {})

bank.index = (req, res, next) => {
    const getService = Bank.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.show = (req, res, next) => {
    const getService = Bank.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.showBy = (req, res, next) => {
    const getService = Bank.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.create = (req, res, next) => {
    const getService = Bank.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.update = (req, res, next) => {
    const getService = Bank.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.delete = (req, res, next) => {
    const getService = Bank.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.deleteAll = (req, res, next) => {
    Bank.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

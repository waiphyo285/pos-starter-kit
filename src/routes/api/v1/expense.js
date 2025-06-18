const utils = require('@utils/index')
const Expense = require('@controllers/expenses')
const { handleDatabase } = require('@utils/handlers/response')

const bank = (module.exports = {})

bank.index = (req, res, next) => {
    const getService = Expense.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.show = (req, res, next) => {
    const getService = Expense.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.showBy = (req, res, next) => {
    const getService = Expense.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.create = (req, res, next) => {
    const getService = Expense.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.update = (req, res, next) => {
    const getService = Expense.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.delete = (req, res, next) => {
    const getService = Expense.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

bank.deleteAll = (req, res, next) => {
    Expense.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

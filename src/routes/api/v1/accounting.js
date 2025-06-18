const utils = require('@utils/index')
const AccPayable = require('@controllers/accounting/payable')
const AccReceivable = require('@controllers/accounting/receivable')
const { handleDatabase } = require('@utils/handlers/response')

const accounting = (module.exports = {})

// Payable accounts
accounting.payable = {}

accounting.payable.index = (req, res, next) => {
    const getService = AccPayable.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.show = (req, res, next) => {
    const getService = AccPayable.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.showBy = (req, res, next) => {
    const getService = AccPayable.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.create = (req, res, next) => {
    const getService = AccPayable.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.update = (req, res, next) => {
    const getService = AccPayable.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.delete = (req, res, next) => {
    const getService = AccPayable.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.payable.deleteAll = (req, res, next) => {
    AccPayable.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

// Receivable accounts
accounting.receivable = {}

accounting.receivable.index = (req, res, next) => {
    const getService = AccReceivable.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.show = (req, res, next) => {
    const getService = AccReceivable.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.showBy = (req, res, next) => {
    const getService = AccReceivable.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.create = (req, res, next) => {
    const getService = AccReceivable.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.update = (req, res, next) => {
    const getService = AccReceivable.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.delete = (req, res, next) => {
    const getService = AccReceivable.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

accounting.receivable.deleteAll = (req, res, next) => {
    AccReceivable.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

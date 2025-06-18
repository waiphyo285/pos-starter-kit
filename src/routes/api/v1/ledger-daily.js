const utils = require('@utils/index')
const LedgerDaily = require('@controllers/ledger-daily')
const { handleDatabase } = require('@utils/handlers/response')

const ledgerDaily = (module.exports = {})

ledgerDaily.index = (req, res, next) => {
    const getService = LedgerDaily.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.show = (req, res, next) => {
    const getService = LedgerDaily.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.showBy = (req, res, next) => {
    const getService = LedgerDaily.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.create = (req, res, next) => {
    const getService = LedgerDaily.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.update = (req, res, next) => {
    const getService = LedgerDaily.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.delete = (req, res, next) => {
    const getService = LedgerDaily.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

ledgerDaily.deleteAll = (req, res, next) => {
    LedgerDaily.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

const utils = require('@utils/index')
const Reporting = require('@controllers/reportings')
const { handleDatabase } = require('@utils/handlers/response')

const reporting = (module.exports = {})

reporting.listDailySales = (req, res, next) => {
    const getService = Reporting.listDailySales(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

reporting.listWeeklySales = (req, res, next) => {
    const getService = Reporting.listWeeklySales(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

reporting.listMonthlySales = (req, res, next) => {
    const getService = Reporting.listMonthlySales(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

const utils = require('@utils/index')
const SalesInvoice = require('@controllers/sales-invoices')
const RefundInvoice = require('@controllers/refund-invoices')
const PurchaseInvoice = require('@controllers/purchase-invoices')
const DamageInvoice = require('@controllers/damage-invoices')
const AdjustInvoice = require('@controllers/adjust-invoices')
const { handleDatabase } = require('@utils/handlers/response')

const invoices = (module.exports = {})

// Sale Invoices
invoices.sales = {}

invoices.sales.index = (req, res, next) => {
    const getService = SalesInvoice.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.show = (req, res, next) => {
    const getService = SalesInvoice.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.showBy = (req, res, next) => {
    const getService = SalesInvoice.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.create = (req, res, next) => {
    const getService = SalesInvoice.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.update = (req, res, next) => {
    const getService = SalesInvoice.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.delete = (req, res, next) => {
    const getService = SalesInvoice.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.sales.deleteAll = (req, res, next) => {
    SalesInvoice.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

// Sale Invoices
invoices.refunds = {}

invoices.refunds.index = (req, res, next) => {
    const getService = RefundInvoice.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.show = (req, res, next) => {
    const getService = RefundInvoice.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.showBy = (req, res, next) => {
    const getService = RefundInvoice.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.create = (req, res, next) => {
    const getService = RefundInvoice.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.update = (req, res, next) => {
    const getService = RefundInvoice.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.delete = (req, res, next) => {
    const getService = RefundInvoice.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.refunds.deleteAll = (req, res, next) => {
    RefundInvoice.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

// Purchase Invoices
invoices.purchases = {}

invoices.purchases.index = (req, res, next) => {
    const getService = PurchaseInvoice.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.show = (req, res, next) => {
    const getService = PurchaseInvoice.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.showBy = (req, res, next) => {
    const getService = PurchaseInvoice.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.create = (req, res, next) => {
    const getService = PurchaseInvoice.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.update = (req, res, next) => {
    const getService = PurchaseInvoice.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.delete = (req, res, next) => {
    const getService = PurchaseInvoice.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.purchases.deleteAll = (req, res, next) => {
    PurchaseInvoice.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

// Damage Invoices
invoices.damages = {}

invoices.damages.index = (req, res, next) => {
    const getService = DamageInvoice.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.show = (req, res, next) => {
    const getService = DamageInvoice.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.showBy = (req, res, next) => {
    const getService = DamageInvoice.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.create = (req, res, next) => {
    const getService = DamageInvoice.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.update = (req, res, next) => {
    const getService = DamageInvoice.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.delete = (req, res, next) => {
    const getService = DamageInvoice.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.deleteAll = (req, res, next) => {
    DamageInvoice.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

// Adjustment Invoices
invoices.adjusts = {}

invoices.adjusts.index = (req, res, next) => {
    const getService = AdjustInvoice.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.adjusts.show = (req, res, next) => {
    const getService = AdjustInvoice.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.adjusts.showBy = (req, res, next) => {
    const getService = AdjustInvoice.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.adjusts.create = (req, res, next) => {
    const getService = AdjustInvoice.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.adjusts.update = (req, res, next) => {
    const getService = AdjustInvoice.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.adjusts.delete = (req, res, next) => {
    const getService = AdjustInvoice.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

invoices.damages.deleteAll = (req, res, next) => {
    AdjustInvoice.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

module.exports = invoices

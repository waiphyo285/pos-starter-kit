const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const SalesInvoice = require('@controllers/sales-invoices')
const RefundInvoice = require('@controllers/refund-invoices')
const PurchaseInvoice = require('@controllers/purchase-invoices')
const AdjustInvoice = require('@controllers/adjust-invoices')
const DamageInvoice = require('@controllers/damage-invoices')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')
const { purchaseInvoiceDto, adjustInvoiceDto, damageInvoiceDto } = require('@models/dto/mongodb/pos.schema')

router
    .get('/sale-invoices', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/sale-invoice-list',
            runProgram: 'sales.sale_invoice.list',
            runContent: 'sale-invoice.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/sale-invoice/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SalesInvoice.findDataById(id) : {}

        const pages = {
            data: data?.data || {},
            runPage: 'pages/sale-invoice-view',
            runProgram: 'sales.sale_invoice.entry',
            runContent: 'sale-invoice.view',
        }
        handleRenderer(req.user, pages, res)
    })

router
    .get('/sale-refunds', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/sale-refund-list',
            runProgram: 'sales.sale_refund.list',
            runContent: 'sale-refund.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/sale-invoice/refund/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SalesInvoice.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/sale-invoice-refund',
            runProgram: 'sales.sale_refund.entry',
            runContent: 'sale-refund.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .put('/sale-refund/:id?', checkAuth, async (req, res) => {
        const getService = RefundInvoice.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

router
    .get('/purchase-invoices', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/purchase-invoice-list',
            runProgram: 'purchase.purchase_invoice.list',
            runContent: 'purchase-invoice.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/purchase-invoice/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await PurchaseInvoice.findDataById(id) : {}
        const pages = {
            data: data.data || { purchase_items: [] },
            runPage: 'pages/purchase-invoice-entry',
            runProgram: 'purchase.purchase_invoice.entry',
            runContent: 'purchase-invoice.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/purchase-invoice', isValidDto(purchaseInvoiceDto), (req, res) => {
        const getService = PurchaseInvoice.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/purchase-invoice/:id?', isValidDto(purchaseInvoiceDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = PurchaseInvoice.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

router
    .get('/damage-invoices', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/damage-invoice-list',
            runProgram: 'inventory.damage_invoice.list',
            runContent: 'damage-invoice.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/damage-invoice/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await DamageInvoice.findDataById(id) : {}
        const pages = {
            data: data.data || { damage_items: [] },
            runPage: 'pages/damage-invoice-entry',
            runProgram: 'inventory.damage_invoice.entry',
            runContent: 'damage-invoice.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/damage-invoice', isValidDto(damageInvoiceDto), (req, res) => {
        const getService = DamageInvoice.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/damage-invoice/:id?', isValidDto(damageInvoiceDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = DamageInvoice.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

router
    .get('/adjust-stocks', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/adjust-stock-list',
            runProgram: 'inventory.adjust_stock.list',
            runContent: 'adjust-stock.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/adjust-stock/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await AdjustInvoice.findDataById(id) : {}
        const pages = {
            data: data.data || { adjust_items: [] },
            runPage: 'pages/adjust-stock-entry',
            runProgram: 'inventory.adjust_stock.entry',
            runContent: 'adjust-stock.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/adjust-stock', isValidDto(adjustInvoiceDto), (req, res) => {
        const getService = AdjustInvoice.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/adjust-stock/:id?', isValidDto(adjustInvoiceDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = AdjustInvoice.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

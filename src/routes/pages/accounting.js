const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const checkAuth = require('@middleware/dto/is-valid-user')
const AccPayable = require('@controllers/accounting/payable')
const AccReceivable = require('@controllers/accounting/receivable')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/acc-payables', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/account-payable-list',
            runProgram: 'accounting.payable.list',
            runContent: 'acc-payable.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/acc-payable/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await AccPayable.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/account-payable-entry',
            runProgram: 'accounting.payable.entry',
            runContent: 'acc-payable.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/acc-payable', (req, res) => {
        const getService = AccPayable.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/acc-payable/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = AccPayable.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

router
    .get('/acc-receivables', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/account-receivable-list',
            runProgram: 'accounting.receivable.list',
            runContent: 'acc-receivable.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/acc-receivable/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await AccReceivable.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/account-receivable-entry',
            runProgram: 'accounting.receivable.entry',
            runContent: 'acc-receivable.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/acc-receivable', (req, res) => {
        const getService = AccReceivable.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/acc-receivable/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = AccReceivable.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

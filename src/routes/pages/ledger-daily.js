const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const LedgerDaily = require('@controllers/ledger-daily')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/daily-ledgers', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/ledger-daily-list',
            runProgram: 'accounting.ledger_daily.list',
            runContent: 'ledger-daily.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/daily-ledger/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await LedgerDaily.findDataById(id) : {}
        const pages = {
            data: data?.data || { transactions: [] },
            runPage: 'pages/ledger-daily-entry',
            runProgram: 'accounting.ledger_daily.entry',
            runContent: 'ledger-daily.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/daily-ledger', (req, res) => {
        const getService = LedgerDaily.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/daily-ledger/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = LedgerDaily.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

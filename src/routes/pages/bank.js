const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Bank = require('@controllers/banks')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { bankDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/banks', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/bank-list',
            runProgram: 'general.bank.list',
            runContent: 'bank.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/bank/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Bank.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/bank-entry',
            runProgram: 'general.bank.entry',
            runContent: 'bank.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/bank', isValidDto(bankDto), (req, res) => {
        const getService = Bank.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/bank/:id?', isValidDto(bankDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Bank.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

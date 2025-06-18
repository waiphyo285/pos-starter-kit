const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Currency = require('@controllers/currencies')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { currencyDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/currencies', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/currency-list',
            runProgram: 'general.currency.list',
            runContent: 'currency.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/currency/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Currency.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/currency-entry',
            runProgram: 'general.currency.entry',
            runContent: 'currency.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/currency', isValidDto(currencyDto), (req, res) => {
        const getService = Currency.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/currency/:id?', isValidDto(currencyDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Currency.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

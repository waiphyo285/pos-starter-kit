const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Customer = require('@controllers/customers')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { customerDto } = require('@models/dto/mongodb/pos.schema')
const { populateUserFields } = require('@middleware/params/index')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/customers', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/customer-list',
            runProgram: 'customer.customer.list',
            runContent: 'customer.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/customer/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Customer.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/customer-entry',
            runProgram: 'customer.customer.entry',
            runContent: 'customer.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/customer', isValidDto(customerDto), (req, res) => {
        const getService = Customer.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .post('/new-customer', populateUserFields, (req, res) => {
        const getService = Customer.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/customer/:id?', isValidDto(customerDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Customer.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

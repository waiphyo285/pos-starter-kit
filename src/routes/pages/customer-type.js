const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const CustomerType = require('@controllers/customer-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { customerTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/customer-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/customer-type-list',
            runProgram: 'customer.customer_type.list',
            runContent: 'customer-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/customer-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await CustomerType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/customer-type-entry',
            runProgram: 'customer.customer_type.entry',
            runContent: 'customer-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/customer-type', isValidDto(customerTypeDto), (req, res) => {
        const getService = CustomerType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/customer-type/:id?', isValidDto(customerTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = CustomerType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

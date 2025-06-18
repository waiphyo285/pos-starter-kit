const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Supplier = require('@controllers/suppliers')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { supplierDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/suppliers', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/supplier-list',
            runProgram: 'supplier.supplier.list',
            runContent: 'supplier.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/supplier/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Supplier.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/supplier-entry',
            runProgram: 'supplier.supplier.entry',
            runContent: 'supplier.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/supplier', isValidDto(supplierDto), (req, res) => {
        const getService = Supplier.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/supplier/:id?', isValidDto(supplierDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Supplier.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

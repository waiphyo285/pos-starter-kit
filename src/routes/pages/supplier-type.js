const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const SupplierType = require('@controllers/supplier-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { supplierTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/supplier-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/supplier-type-list',
            runProgram: 'supplier.supplier_type.list',
            runContent: 'supplier-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/supplier-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SupplierType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/supplier-type-entry',
            runProgram: 'supplier.supplier_type.entry',
            runContent: 'supplier-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/supplier-type', isValidDto(supplierTypeDto), (req, res) => {
        const getService = SupplierType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/supplier-type/:id?', isValidDto(supplierTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = SupplierType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

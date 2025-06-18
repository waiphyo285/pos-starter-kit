const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const StoreType = require('@controllers/store-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { storeTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/store-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/store-type-list',
            runProgram: 'store.store_type.list',
            runContent: 'store-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/store-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await StoreType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/store-type-entry',
            runProgram: 'store.store_type.entry',
            runContent: 'store-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/store-type', isValidDto(storeTypeDto), (req, res) => {
        const getService = StoreType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/store-type/:id?', isValidDto(storeTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = StoreType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

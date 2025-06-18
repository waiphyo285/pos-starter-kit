const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Store = require('@controllers/stores')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { storeDto } = require('@models/dto/mongodb/pos.schema')
const { checkStoreToCreate } = require('@middleware/check-store')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/stores', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/store-list',
            runProgram: 'store.store.list',
            runContent: 'store.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/store/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Store.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/store-entry',
            runProgram: 'store.store.entry',
            runContent: 'store.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/store', isValidDto(storeDto), checkStoreToCreate, (req, res) => {
        const getService = Store.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/store/:id?', isValidDto(storeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Store.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

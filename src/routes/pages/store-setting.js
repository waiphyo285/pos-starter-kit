const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const StoreSetting = require('@controllers/store-settings')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { storeSettingDto } = require('@models/dto/mongodb/pos.schema')
const { populateUserFields } = require('@middleware/params/index')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/store-settings', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/store-setting-list',
            runProgram: 'setting.store_setting.list',
            runContent: 'store-setting.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/store-setting/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await StoreSetting.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/store-setting-entry',
            runProgram: 'setting.store_setting.entry',
            runContent: 'store-setting.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/store-setting', isValidDto(storeSettingDto), populateUserFields, (req, res) => {
        const getService = StoreSetting.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/store-setting/:id?', isValidDto(storeSettingDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = StoreSetting.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

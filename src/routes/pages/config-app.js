const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const ConfigApp = require('@controllers/config-apps')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { configAppDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/config-apps', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/config-app-list',
            runProgram: 'developer.config_app.list',
            runContent: 'config-app.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/config-app/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await ConfigApp.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/config-app-entry',
            runProgram: 'developer.config_app.entry',
            runContent: 'config-app.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/config-app', isValidDto(configAppDto), (req, res) => {
        const getService = ConfigApp.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/config-app/:id?', isValidDto(configAppDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = ConfigApp.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

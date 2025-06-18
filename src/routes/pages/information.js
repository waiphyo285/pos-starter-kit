const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Information = require('@controllers/information')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/informations', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/information-list',
            runProgram: 'general.information.list',
            runContent: 'information.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/information/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Information.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/information-entry',
            runProgram: 'general.information.entry',
            runContent: 'information.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/information', (req, res) => {
        const getService = Information.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/information/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Information.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

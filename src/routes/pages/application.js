const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Information = require('@controllers/information')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/application', checkAuth, async (req, res) => {
        const data = await Information.findDataBy({})
        const pages = {
            data: (data.data?.length && data.data[0]) || {},
            runPage: 'pages/developers/application',
            runProgram: 'developer.application.entry',
            runContent: 'application.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/application', (req, res) => {
        const getService = Information.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/application/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Information.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

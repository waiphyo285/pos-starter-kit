const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Township = require('@controllers/townships')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { townshipDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/townships', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/township-list',
            runProgram: 'general.township.list',
            runContent: 'township.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/township/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Township.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/township-entry',
            runProgram: 'general.township.entry',
            runContent: 'township.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/township', isValidDto(townshipDto), (req, res) => {
        const getService = Township.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/township/:id?', isValidDto(townshipDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Township.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

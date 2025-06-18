const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const City = require('@controllers/cities')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { cityDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/cities', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/city-list',
            runProgram: 'general.city.list',
            runContent: 'city.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/city/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await City.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/city-entry',
            runProgram: 'general.city.entry',
            runContent: 'city.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/city', isValidDto(cityDto), (req, res) => {
        const getService = City.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/city/:id?', isValidDto(cityDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = City.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

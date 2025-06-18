const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Holiday = require('@controllers/holidays')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { holidayDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/holidays', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/holiday-list',
            runProgram: 'employee.holiday.list',
            runContent: 'holiday.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/holiday/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Holiday.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/holiday-entry',
            runProgram: 'employee.holiday.entry',
            runContent: 'holiday.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/holiday', isValidDto(holidayDto), (req, res) => {
        const getService = Holiday.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/holiday/:id?', isValidDto(holidayDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Holiday.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Notification = require('@controllers/notifications')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/notifications', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/notification-list',
            runProgram: 'setting.notification.list',
            runContent: 'notification.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/notification/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Notification.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/notification-entry',
            runProgram: 'setting.notification.entry',
            runContent: 'notification.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/notification', (req, res) => {
        const getService = Notification.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/notification/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Notification.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

const express = require('express')
const router = express.Router()

// api routing
const configApp = require('./config-app')

// middlewares
const isValidDto = require('@middleware/dto/is-valid-dto')

// schema validations
const { configAppDto } = require('@models/dto/mongodb/core.schema')

module.exports = router

router
    .get('/config-apps', configApp.index)
    .get('/config-app/:id', configApp.show)
    .get('/config-app', configApp.showBy)
    .post('/config-app', isValidDto(configAppDto), configApp.create)
    .put('/config-app/:id', isValidDto(configAppDto), configApp.update)
    .delete('/config-app/:id', configApp.delete)

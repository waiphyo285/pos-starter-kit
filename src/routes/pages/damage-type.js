const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const DamageType = require('@controllers/damage-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { damageTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/damage-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/damage-type-list',
            runProgram: 'inventory.damage_type.list',
            runContent: 'damage-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/damage-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await DamageType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/damage-type-entry',
            runProgram: 'inventory.damage_type.entry',
            runContent: 'damage-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/damage-type', isValidDto(damageTypeDto), (req, res) => {
        const getService = DamageType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/damage-type/:id?', isValidDto(damageTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = DamageType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

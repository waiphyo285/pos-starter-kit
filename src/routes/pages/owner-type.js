const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const OwnerType = require('@controllers/owner-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { ownerTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/owner-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/owner-type-list',
            runProgram: 'owner.owner_type.list',
            runContent: 'owner-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/owner-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await OwnerType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/owner-type-entry',
            runProgram: 'owner.owner_type.entry',
            runContent: 'owner-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/owner-type', isValidDto(ownerTypeDto), (req, res) => {
        const getService = OwnerType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/owner-type/:id?', isValidDto(ownerTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = OwnerType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

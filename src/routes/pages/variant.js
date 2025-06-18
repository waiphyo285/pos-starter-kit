const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Variant = require('@controllers/variants')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { variantDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/variants', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/variant-list',
            runProgram: 'catalogue.variant.list',
            runContent: 'variant.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/variant/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Variant.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/variant-entry',
            runProgram: 'catalogue.variant.list',
            runContent: 'variant.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/variant', isValidDto(variantDto), (req, res) => {
        utils.removeImages(req.body.remove_images || []).then((_res) => {
            // eslint-disable-next-line no-self-assign
            req.body.images = req.body.images
            const getService = Variant.addData(req.body)
            handleDatabase(getService, utils.isEmptyObject, res)
        })
    })
    .put('/variant/:id?', isValidDto(variantDto), (req, res) => {
        utils.removeImages(req.body.remove_images || []).then((_res) => {
            const { ['id']: rmId, ...data } = req.body
            // eslint-disable-next-line no-self-assign
            data.images = data.images
            const getService = Variant.updateData(rmId, data)
            handleDatabase(getService, utils.isEmptyObject, res)
        })
    })

module.exports = router

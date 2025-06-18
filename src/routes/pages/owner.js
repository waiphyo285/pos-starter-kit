const express = require('express')
const router = express.Router()

const Owner = require('@controllers/owners')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { ownerDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

const utils = require('@utils/index')
const { getTotalDocs } = require('@utils/schema')
const { services } = require('@config/constant')

router
    .get('/owners', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/owner-list',
            runProgram: 'owner.owner.list',
            runContent: 'owner.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/owner/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Owner.findDataById(id) : {}

        const storeUrl = utils.toPluralize(services.store)
        const storeCount = await getTotalDocs(services.store, {
            owner_id: id,
        })

        const pages = {
            data: data?.data || {},
            options: {
                pageInfo: [
                    {
                        url: `${storeUrl}?n_filter[owner_id]=${id}`,
                        total_count: storeCount,
                    },
                ],
            },
            runPage: 'pages/owner-entry',
            runProgram: 'owner.owner.entry',
            runContent: 'owner.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/owner', isValidDto(ownerDto), (req, res) => {
        const getService = Owner.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/owner/:id?', isValidDto(ownerDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Owner.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

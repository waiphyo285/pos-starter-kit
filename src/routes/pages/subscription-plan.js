const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const SubscriptionPlan = require('@controllers/subscription-plans')
const { subscribePlanDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/subscription-plans', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/subscription-plan-list',
            runProgram: 'developer.subscription_plan.list',
            runContent: 'subscription-plan.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/subscription-plan/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SubscriptionPlan.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/subscription-plan-entry',
            runProgram: 'developer.subscription_plan.entry',
            runContent: 'subscription-plan.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/subscription-plan', isValidDto(subscribePlanDto), (req, res) => {
        const getService = SubscriptionPlan.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/subscription-plan/:id?', isValidDto(subscribePlanDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = SubscriptionPlan.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const CouponType = require('@controllers/coupon-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { couponTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/coupon-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/coupon-type-list',
            runProgram: 'promotion.coupon_type.list',
            runContent: 'coupon-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/coupon-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await CouponType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/coupon-type-entry',
            runProgram: 'promotion.coupon_type.entry',
            runContent: 'coupon-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/coupon-type', isValidDto(couponTypeDto), (req, res) => {
        const getService = CouponType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/coupon-type/:id?', isValidDto(couponTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = CouponType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

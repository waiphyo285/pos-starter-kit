const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const CouponCode = require('@controllers/coupon-codes')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { couponCodeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/coupon-codes', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/coupon-code-list',
            runProgram: 'promotion.coupon_code.list',
            runContent: 'coupon-code.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/coupon-code/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await CouponCode.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/coupon-code-entry',
            runProgram: 'promotion.coupon_code.entry',
            runContent: 'coupon-code.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/coupon-code', isValidDto(couponCodeDto), (req, res) => {
        const getService = CouponCode.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/coupon-code/:id?', isValidDto(couponCodeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = CouponCode.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

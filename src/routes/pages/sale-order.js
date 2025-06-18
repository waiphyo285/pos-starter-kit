const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const SaleOrder = require('@controllers/sale-orders')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { saleOrderDto } = require('@models/dto/mongodb/pos.schema')
const { checkStockSaleOrder } = require('@middleware/check-stock')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/sale-orders', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/sale-order-list',
            runProgram: 'sales.sale_order.list',
            runContent: 'sale-order.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/sale-order/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SaleOrder.findDataById(id) : {}
        const pages = {
            data: data.data || { order_items: [] },
            runPage: 'pages/sale-order-entry',
            runProgram: 'sales.sale_order.entry',
            runContent: 'sale-order.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/sale-order', isValidDto(saleOrderDto), checkStockSaleOrder, (req, res) => {
        const getService = SaleOrder.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/sale-order/:id?', isValidDto(saleOrderDto), checkStockSaleOrder, (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = SaleOrder.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

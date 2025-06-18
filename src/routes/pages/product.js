const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Product = require('@controllers/products')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { productDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/products', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/product-list',
            runProgram: 'catalogue.product.list',
            runContent: 'product.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/product/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Product.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/product-entry',
            runProgram: 'catalogue.product.entry',
            runContent: 'product.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/product', isValidDto(productDto), (req, res) => {
        utils.removeImages(req.body.remove_images || []).then((_res) => {
            // eslint-disable-next-line no-self-assign
            req.body.images = req.body.images
            const getService = Product.addData(req.body)
            handleDatabase(getService, utils.isEmptyObject, res)
        })
    })
    .put('/product/:id?', isValidDto(productDto), (req, res) => {
        utils.removeImages(req.body.remove_images || []).then((_res) => {
            const { ['id']: rmId, ...data } = req.body
            // eslint-disable-next-line no-self-assign
            data.images = data.images
            const getService = Product.updateData(rmId, data)
            handleDatabase(getService, utils.isEmptyObject, res)
        })
    })

module.exports = router

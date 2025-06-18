const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Category = require('@controllers/categories')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { categoryDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/categories', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/category-list',
            runProgram: 'catalogue.category.list',
            runContent: 'category.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/category/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Category.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/category-entry',
            runProgram: 'catalogue.category.entry',
            runContent: 'category.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/category', isValidDto(categoryDto), (req, res) => {
        const getService = Category.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/category/:id?', isValidDto(categoryDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Category.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

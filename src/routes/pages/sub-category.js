const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const SubCategory = require('@controllers/sub-categories')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { subCategoryDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/sub-categories', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/sub-category-list',
            runProgram: 'catalogue.sub_category.list',
            runContent: 'sub-category.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/sub-category/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await SubCategory.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/sub-category-entry',
            runProgram: 'catalogue.sub_category.list',
            runContent: 'sub-category.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/sub-category', isValidDto(subCategoryDto), (req, res) => {
        const getService = SubCategory.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/sub-category/:id?', isValidDto(subCategoryDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = SubCategory.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

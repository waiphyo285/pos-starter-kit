const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Expense = require('@controllers/expenses')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { expenseDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/expenses', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/expense-list',
            runProgram: 'purchase.expense.list',
            runContent: 'expense.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/expense/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Expense.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/expense-entry',
            runProgram: 'purchase.expense.entry',
            runContent: 'expense.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/expense', isValidDto(expenseDto), (req, res) => {
        const getService = Expense.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/expense/:id?', isValidDto(expenseDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Expense.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

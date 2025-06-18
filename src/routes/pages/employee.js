const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Employee = require('@controllers/employees')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { employeeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/employees', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/employee-list',
            runProgram: 'employee.employee.list',
            runContent: 'employee.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/employee/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await Employee.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/employee-entry',
            runProgram: 'employee.employee.entry',
            runContent: 'employee.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/employee', isValidDto(employeeDto), (req, res) => {
        const getService = Employee.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/employee/:id?', isValidDto(employeeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = Employee.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

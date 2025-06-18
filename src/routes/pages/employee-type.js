const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const EmployeeType = require('@controllers/employee-types')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { employeeTypeDto } = require('@models/dto/mongodb/pos.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/employee-types', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/employee-type-list',
            runProgram: 'employee.employee_type.list',
            runContent: 'employee-type.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/employee-type/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const data = id ? await EmployeeType.findDataById(id) : {}
        const pages = {
            data: data?.data || {},
            runPage: 'pages/employee-type-entry',
            runProgram: 'employee.employee_type.entry',
            runContent: 'employee-type.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/employee-type', isValidDto(employeeTypeDto), (req, res) => {
        const getService = EmployeeType.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/employee-type/:id?', isValidDto(employeeTypeDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = EmployeeType.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

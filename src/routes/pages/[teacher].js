const express = require('express')
const router = express.Router()
// const utils = require('@utils/index')
// const Teacher = require('@controllers/teachers')
// const checkAuth = require('@middleware/dto/is-valid-user')
// const isValidDto = require('@middleware/dto/is-valid-dto')
// const { teacherDto } = require('@models/dto/mysqldb/sample.schema')
// const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

// router
//     .get('/teachers', checkAuth, (req, res) => {
//         const pages = {
//             runPage: 'pages/teacher-list',
//             runProgram: 'course.teacher.list',
//             runContent: 'teacher.list',
//         }
//         handleRenderer(req.user, pages, res)
//     })
//     .get('/teacher/:id?', checkAuth, async (req, res) => {
//         const id = req.params.id
//         const data = id ? await Teacher.findDataById(id) : {}
//         const pages = {
//             data: data?.data || {},
//             runPage: 'pages/teacher-entry',
//             runProgram: 'course.teacher.entry',
//             runContent: 'teacher.entry',
//         }
//         handleRenderer(req.user, pages, res)
//     })
//     .post('/teacher', isValidDto(teacherDto), (req, res) => {
//         const getService = Teacher.addData(req.body)
//         handleDatabase(getService, utils.isEmptyObject, res)
//     })
//     .put('/teacher/:id?', isValidDto(teacherDto), (req, res) => {
//         const { ['id']: rmId, ...data } = req.body
//         const getService = Teacher.updateData(rmId, data)
//         handleDatabase(getService, utils.isEmptyObject, res)
//     })

module.exports = router

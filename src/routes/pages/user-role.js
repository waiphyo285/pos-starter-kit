const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const UserRole = require('@controllers/user-roles')
const checkAuth = require('@middleware/dto/is-valid-user')
const isValidDto = require('@middleware/dto/is-valid-dto')
const { userRoleDto } = require('@models/dto/mongodb/core.schema')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

const programMenu = require('@config/program/menu-en.json')

router
    .get('/user-roles', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/user-role-list',
            runProgram: 'admin.role.list',
            runContent: 'system-role.list',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/user-role/:id?', checkAuth, async (req, res) => {
        const id = req.params.id
        const initProgram = JSON.parse(JSON.stringify(programMenu))

        let data = { data: { program: initProgram } } // new entry

        if (id) {
            // edit role
            data = await UserRole.findDataById(id)
            const userProgram = data.data.program

            data.data.program = initProgram.map((initMenu) => {
                const findMenu = userProgram.find((userMenu) => userMenu.menuid == initMenu.menuid)

                let subMenuMap

                if (findMenu) {
                    subMenuMap = initMenu.submenu.map((initSubMenu) => {
                        const findSubMenu = findMenu.submenu.find(
                            (userSubMenu) => userSubMenu.menuid == initSubMenu.menuid
                        )
                        return { ...initSubMenu, ...findSubMenu }
                    })
                }
                return { ...initMenu, ...findMenu, submenu: subMenuMap }
            })
        }

        const pages = {
            data: data.data,
            runPage: 'pages/user-role-entry',
            runProgram: 'admin.role.entry',
            runContent: 'system-role.entry',
        }

        handleRenderer(req.user, pages, res)
    })
    .post('/user-role', isValidDto(userRoleDto), (req, res) => {
        req.body.who_access = req.user.user_type
        const getService = UserRole.addData(req.body)
        handleDatabase(getService, utils.isEmptyObject, res)
    })
    .put('/user-role/:id?', isValidDto(userRoleDto), (req, res) => {
        const { ['id']: rmId, ...data } = req.body
        const getService = UserRole.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

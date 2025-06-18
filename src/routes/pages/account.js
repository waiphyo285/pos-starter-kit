const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const User = require('@controllers/users')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/account', checkAuth, async (req, res) => {
        let resData = {}
        const id = req.user._id
        const data = id ? await User.findUserById(id) : {}

        if (data.data) {
            const userLogs = await User.findUserLog({
                user_id: data.data._id,
            })

            resData = {
                ...data.data,
                user_logs: userLogs.data || [],
            }
        }

        const pages = {
            data: resData,
            runPage: 'pages/settings/account',
            runProgram: 'setting.account.entry',
            runContent: 'account.entry',
        }

        handleRenderer(req.user, pages, res)
    })
    .put('/account/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body

        if (data.old_password && data.password) {
            const getService = User.updateWithPass(rmId, data)
            handleDatabase(getService, utils.isEmptyObject, res)
        } else {
            const getService = User.updateWithoutPass(rmId, data)
            handleDatabase(getService, utils.isEmptyObject, res)
        }
    })

module.exports = router

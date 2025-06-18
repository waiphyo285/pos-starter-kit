const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Setting = require('@controllers/settings')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

router
    .get('/setting', checkAuth, async (req, res) => {
        let resData = {}
        const account_id = req.user.account_id

        if (account_id) {
            const data = account_id
                ? await Setting.findDataBy({
                      filter: {
                          owner_id: account_id.owner_id,
                      },
                  })
                : {}
            resData = { ...data.data[0] }
        }

        const pages = {
            data: resData,
            runPage: 'pages/settings/setting',
            runProgram: 'setting.setting.entry',
            runContent: 'setting.entry',
        }

        handleRenderer(req.user, pages, res)
    })
    .put('/setting/:id?', (req, res) => {
        const { ['id']: rmId, ...data } = req.body

        const getService = Setting.updateData(rmId, data)
        handleDatabase(getService, utils.isEmptyObject, res)
    })

module.exports = router

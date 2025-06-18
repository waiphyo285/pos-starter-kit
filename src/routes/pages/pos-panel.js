const express = require('express')
const router = express.Router()
const config = require('@config/env')
const Variant = require('@controllers/variants')
const Category = require('@controllers/categories')
const checkAuth = require('@middleware/dto/is-valid-user')
const { populateReqParams } = require('@middleware/params')
const { getProgram } = require('@utils/handlers/access-user')
const { getContent } = require('@utils/handlers/get-content')

router.get('/pos-panel', checkAuth, populateReqParams, async (req, res) => {
    const query = {
        filter: { status: true },
        n_filter: req.query.n_filter,
    }

    const variantList = await Variant.findDataBy(query)
    const categoryList = await Category.findDataBy(query)

    const curUserProgram = await getProgram(req.user, 'pos_panel.null.null')
    const getPageContent = await getContent(req.user.locale, 'pos-panel', [])

    const data = {
        variantList: variantList.data || [],
        categoryList: categoryList.data || [],
    }

    res.render('pages/pos-panel', {
        ...curUserProgram,
        app: config.APP,
        data: data,
        content: getPageContent,
    })
})

module.exports = router

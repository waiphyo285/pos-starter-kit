const express = require('express')
const router = express.Router()
const utils = require('@utils/index')
const Variant = require('@controllers/variants')
const checkAuth = require('@middleware/dto/is-valid-user')
const { constant } = require('@config/constant')
const { handleRenderer, handleDatabase } = require('@utils/handlers/response')

const { by_each, by_category, change_price, add_discount_price, remove_discount_price } = constant

function getSuffixTag(category, tag) {
    switch (true) {
        case category === change_price && tag === by_each:
            return ''

        case category === change_price && tag === by_category:
            return '2'

        case category === add_discount_price && tag === by_each:
            return '3'

        case category === add_discount_price && tag === by_category:
            return '4'

        case category === remove_discount_price && tag === by_each:
            return '5'

        case category === remove_discount_price && tag === by_category:
            return '6'

        default:
            return ''
    }
}

router
    .get('/control-prices', checkAuth, (req, res) => {
        const pages = {
            runPage: 'pages/control-price-starter',
            runProgram: 'sales.control_price.starter',
            runContent: 'control-price.stater',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/control-prices/:category', checkAuth, (req, res) => {
        const pages = {
            data: { category: req.params.category },
            runPage: 'pages/control-price-chosen',
            runProgram: 'sales.control_price.chosen',
            runContent: 'control-price.chosen',
        }
        handleRenderer(req.user, pages, res)
    })
    .get('/control-prices/:category/:tag', checkAuth, (req, res) => {
        const tag = req.params.tag
        const category = req.params.category

        const suffixTag = getSuffixTag(category, tag)

        const pages = {
            data: { category, tag },
            runPage: `pages/control-price-entry${suffixTag}`,
            runProgram: 'sales.control_price.entry',
            runContent: 'control-price.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/control-price', (req, res) => {
        const { tag, category, ...rest } = req.body

        let getService
        let params = { category, tag },
            body = {}

        switch (true) {
            case category === change_price && tag === by_each:
                body = rest.price_items
                getService = Variant.changePrice(params, body)
                break

            case category === change_price && tag === by_category:
                params = {
                    ...params,
                    category_id: rest.category_id,
                }
                body = {
                    retail_price: rest.change_retail_price,
                    wholesale_price: rest.change_wholesale_price,
                }
                getService = Variant.changePrice(params, body)
                break

            case category === add_discount_price && tag === by_each:
                body = rest.discount_items
                getService = Variant.addDiscount(params, body)
                break

            case category === add_discount_price && tag === by_category:
                params = {
                    ...params,
                    category_id: rest.category_id,
                }
                body = {
                    discount_method: rest.discount_method,
                    discount_amount: rest.discount_price,
                }
                getService = Variant.addDiscount(params, body)
                break

            case category === remove_discount_price && tag === by_each:
                body = rest.discount_items
                getService = Variant.removeDiscount(params, body)
                break

            case category === remove_discount_price && tag === by_category:
                params = {
                    ...params,
                    category_id: rest.category_id,
                }
                body = {
                    discount_amount: rest.discount_price,
                }
                getService = Variant.removeDiscount(params, body)
                break

            default:
                // Handle the default case
                break
        }

        if (getService) {
            handleDatabase(getService, utils.isEmptyObject, res)
        }
    })

module.exports = router

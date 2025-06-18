const express = require('express')
const router = express.Router()
const csv = require('csvtojson')
const Category = require('@controllers/categories')
const SubCategory = require('@controllers/sub-categories')
const Product = require('@controllers/products')
const Variant = require('@controllers/variants')

const checkAuth = require('@middleware/dto/is-valid-user')
const { mongoose } = require('@models/mongodb/connection')

const { generateCode } = require('@utils/schema')
const { handleRenderer } = require('@utils/handlers/response')
const { createResponse } = require('@utils/handlers/response')

const IMPORT_OK = 'Excel data has been successfully imported'
const IMPORT_ERR = 'Unfortunately can not import data!'

async function* processProductCSV(path, rest) {
    const productList = await csv().fromFile(path)

    const productLength = productList.length

    const codeObj = {
        type: 'product',
        prefix: 'PRD',
        isPlain: true,
        increaseCount: productLength,
    }

    let startCode = await generateCode(codeObj)

    const categoryList = await Category.findDataByCode(productList.map((product) => product.category))

    const subCategoryList = await SubCategory.findDataByCode(productList.map((product) => product.subcategory))

    for (const product of productList) {
        const date = new Date()
        const findCategory = categoryList.find((category) => category.name === product.category)

        const findSubCategory = subCategoryList.find((subCategory) => subCategory.name === product.subcategory)

        if (findCategory) {
            product.category_id = findCategory._id
        }

        if (findSubCategory) {
            product.sub_category_id = findSubCategory._id
        }

        const barcode = 'PRD' + String(startCode).padStart(8, '0')

        product.owner_id = rest.owner_id
        product.store_id = rest.store_id
        product.barcode = product.barcode || barcode
        product.created_at = date
        product.updated_at = date

        yield product
        startCode++
    }
}

async function* processVariantCSV(path, rest) {
    const itemList = await csv().fromFile(path)

    const itemLength = itemList.length

    const codeObj = {
        type: 'variant',
        prefix: 'VAR',
        isPlain: true,
        increaseCount: itemLength,
    }

    let startCode = await generateCode(codeObj)

    const productList = await Product.findDataByCode(itemList.map((item) => item.product))

    for (const variant of itemList) {
        const date = new Date()
        const findProduct = productList.find((product) => product.barcode === variant.product)

        if (findProduct) {
            const barcode = 'VAR' + String(startCode).padStart(8, '0')

            variant.store_id = findProduct.owner_id
            variant.store_id = findProduct.store_id
            variant.category_id = findProduct.category_id
            variant.sub_category_id = findProduct.sub_category_id
            variant.product_id = findProduct._id
            variant.barcode = variant.barcode || barcode

            variant.created_at = date
            variant.updated_at = date

            yield variant
            startCode++
        }
    }
}

function switchToProcessCSV(collection, path, rest) {
    switch (true) {
        case collection === 'product':
            return processProductCSV(path, rest)

        case collection === 'variant':
            return processVariantCSV(path, rest)

        default:
            break
    }
}

router
    .get('/import-data', checkAuth, async (req, res) => {
        const pages = {
            data: {},
            runPage: 'pages/settings/importing',
            runProgram: 'developer.import_data.entry',
            runContent: 'import-data.entry',
        }
        handleRenderer(req.user, pages, res)
    })
    .post('/import-data', async (req, res) => {
        const { collection, path, ...rest } = req.body
        const locales = res.locals.i18n.translations

        try {
            const dataList = []

            for await (const variant of switchToProcessCSV(collection, path, rest)) {
                dataList.push(variant)
            }

            await mongoose.model(collection).insertMany(dataList)

            res.status(200).json(createResponse(200, { data: { message: IMPORT_OK } }, locales))
        } catch (error) {
            res.status(500).json(createResponse(500, { data: { message: IMPORT_ERR } }, locales))
        }
    })

module.exports = router

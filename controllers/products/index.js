const async = require('async')
const mongoose = require('mongoose')

const serialize = require('../serializer2')
const Store = require('@models/mongodb/schemas/store')
const Product = require('@models/mongodb/schemas/product')
const Variant = require('@models/mongodb/schemas/variant')

const { services } = require('@config/constant')
const { generateCode } = require('@utils/schema')
const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const service = services.product

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Product.countDocuments(filter)

    return Product.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'owner_id',
            model: 'owner',
            select: 'name',
        })
        .populate({
            path: 'store_id',
            model: 'store',
            select: 'name',
        })
        .populate({
            path: 'category_id',
            model: 'category',
            select: 'name',
        })
        .populate({
            path: 'sub_category_id',
            model: 'sub_category',
            select: 'name',
        })
        .lean()
        .then((data) => {
            return serialize(
                {
                    data,
                    draw,
                    recordsTotal,
                    recordsFiltered: recordsTotal,
                },
                service,
                true
            )
        })
}

controller.findDataById = (id) => {
    return Product.findById(id).lean().then(serialize)
}

controller.findDataByCode = (codes) => {
    return Product.find({ barcode: { $in: codes } })
}

controller.findDataBy = async (params) => {
    const { sort, filter, skip, limit } = await getPaginationQuery(params)

    const recordsTotal = await Product.countDocuments(filter)

    return Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .then((data) => {
            return serialize({
                data,
                recordsTotal,
                recordsFiltered: recordsTotal,
            })
        })
}

controller.addData = async (dataObj) => {
    const date = new Date()
    const ownerId = dataObj.owner_id
    const isVariant = dataObj.is_variant
    const applyAllStore = dataObj.apply_all_store

    dataObj.created_at = date
    dataObj.updated_at = date

    if (applyAllStore) {
        const stores = await Store.find({ owner_id: ownerId }).select('').lean()

        const prdCount = await generateCode({ type: 'product', prefix: 'PRD', isPlain: true })
        const varCount = await generateCode({ type: 'variant', prefix: 'VAR', isPlain: true })

        const prdArray = stores.map((store, idx) => {
            return {
                ...dataObj,
                store_id: store._id,
                barcode: dataObj.barcode || `PRD${String(prdCount + idx).padStart(8, '0')}`,
            }
        })

        return Product.insertMany(prdArray)
            .then((res) => {
                if (isVariant) {
                    const varArray = res.map((product, idx) => {
                        return {
                            ...dataObj,
                            stock: 0,
                            product_id: mongoose.Types.ObjectId(product._id),
                            barcode: dataObj.barcode || `VAR${String(varCount + idx).padStart(8, '0')}`,
                        }
                    })

                    return Variant.insertMany(varArray)
                }

                return res
            })
            .then(serialize)
    }

    let newBarcode = dataObj.barcode || (await generateCode({ type: 'product', prefix: 'PRD' }))

    return Product.create({
        ...dataObj,
        barcode: newBarcode,
    })
        .then(async (res) => {
            if (isVariant) {
                newBarcode = dataObj.barcode || (await generateCode({ type: 'variant', prefix: 'VAR' }))
                return Variant.create({ ...dataObj, product_id: res._id, barcode: newBarcode })
            }

            return res
        })
        .then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Product.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'variant',
                key: 'product_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return Product.findByIdAndDelete(id).lean().then(serialize)
    return Product.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

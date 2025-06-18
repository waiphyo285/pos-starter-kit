const serialize = require('../serializer2')
const Store = require('@models/mongodb/schemas/store')
const Variant = require('@models/mongodb/schemas/variant')

const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services, constant } = require('@config/constant')

const service = services.variant

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Variant.countDocuments(filter)

    return Variant.find(filter)
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
        .populate({
            path: 'product_id',
            model: 'product',
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
    return Variant.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { sort, filter, skip, limit } = await getPaginationQuery(params)

    const recordsTotal = await Variant.countDocuments(filter)

    let w_regx = []
    let s_word = params.search || { name: '' }

    if (s_word) {
        Object.keys(s_word).forEach((key) => {
            const regx = new RegExp(s_word[key].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''), 'i')

            w_regx.push({ [key]: { $regex: regx } })
        })
    }

    return Variant.find(filter)
        .or({
            $or: w_regx,
        })
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
    const applyAllStore = dataObj.apply_all_store

    dataObj.created_at = date
    dataObj.updated_at = date

    if (applyAllStore) {
        const stores = await Store.find({ owner_id: ownerId }).select('').lean()
        const varCount = await generateCode({ type: 'variant', prefix: 'VAR', isPlain: true })

        const varArray = stores.map((store, idx) => {
            return {
                ...dataObj,
                store_id: store._id,
                barcode: dataObj.barcode || `VAR${String(varCount + idx).padStart(8, '0')}`,
            }
        })

        return Variant.insertMany(varArray).then(serialize)
    }

    dataObj.barcode = dataObj.barcode || (await generateCode({ type: 'variant', prefix: 'VAR' }))

    return Variant.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    return Variant.findByIdAndUpdate(id, dataObj)
}

controller.updateDataBy = (params, dataObj) => {
    const filter = params

    return Variant.updateMany(filter, { $set: dataObj })
}

controller.addDiscount = async (params, dataObj) => {
    if (params.tag === constant.by_each) {
        const updateOps = dataObj.map(({ item_id, discount_method, discount_price: discount_amount }) => ({
            updateOne: {
                filter: { _id: item_id },
                update:
                    discount_method === constant.percent
                        ? [
                              {
                                  $set: {
                                      discount_method: discount_method,
                                      discount_amount: {
                                          $multiply: [
                                              {
                                                  $ifNull: ['$retail_price', 0],
                                              },
                                              parseFloat(discount_amount) / 100,
                                          ],
                                      },
                                  },
                              },
                          ]
                        : {
                              $set: {
                                  discount_method: discount_method,
                                  discount_amount: parseFloat(discount_amount),
                              },
                          },
            },
        }))

        return Variant.bulkWrite(updateOps).then(serialize)
    }

    if (params.tag === constant.by_category) {
        if (dataObj.discount_method === constant.amount) {
            return updateDataBy(params, dataObj)
        }

        if (dataObj.discount_method === constant.percent) {
            const { discount_method, discount_amount } = dataObj
            return Variant.updateMany({ category_id: params.category_id }, [
                {
                    $set: {
                        discount_method: discount_method,
                        discount_amount: {
                            $cond: {
                                if: {
                                    $eq: [discount_method, constant.percent],
                                },
                                then: {
                                    $multiply: [
                                        {
                                            $ifNull: ['$retail_price', 0],
                                        },
                                        parseFloat(discount_amount) / 100,
                                    ],
                                },
                                else: parseFloat(discount_amount),
                            },
                        },
                    },
                },
            ])
        }
    }

    return null
}

controller.removeDiscount = async (params, dataObj) => {
    if (params.tag === constant.by_each) {
        const updateOps = dataObj.map(({ item_id, discount_method, discount_price: discount_amount }) => ({
            updateOne: {
                filter: { _id: item_id },
                update: {
                    $set: {
                        discount_method: discount_method,
                        discount_amount: parseFloat(discount_amount),
                    },
                },
            },
        }))

        return Variant.bulkWrite(updateOps).then(serialize)
    }

    if (params.tag === constant.by_category) {
        const { category_id, ...restParams } = params
        return updateDataBy({ category_id }, dataObj)
    }

    return null
}

controller.changePrice = (params, dataObj) => {
    if (params.tag === constant.by_each) {
        const updateOps = dataObj.map(({ item_id, retail_price, wholesale_price }) => ({
            updateOne: {
                filter: { _id: item_id },
                update: {
                    retail_price: retail_price,
                    wholesale_price: wholesale_price,
                    updated_at: new Date(),
                },
            },
        }))

        return Variant.bulkWrite(updateOps).then(serialize)
    }

    if (params.tag === constant.by_category) {
        const { category_id, ...restParams } = params
        return updateDataBy({ category_id }, dataObj)
    }

    return null
}

// eslint-disable-next-line no-unused-vars
controller.deleteData = (id) => {
    // return Variant.findByIdAndDelete(id).lean().then(serialize)
    return Variant.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

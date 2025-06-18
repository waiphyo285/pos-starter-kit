const { getDateRange } = require('./index')
const { mongoose } = require('@models/mongodb/connection')
const GenerateCode = require('@models/mongodb/schemas/code')

/**
 * Models Functions
 */

const schema = (module.exports = {})

schema.objectId = function (id) {
    return id ? mongoose.Types.ObjectId(id) : mongoose.Types.ObjectId()
}

schema.getTotalDocs = async function (model, filter = {}) {
    return mongoose.model(model).countDocuments(filter, (err, count) => {
        if (err) throw new Error(err)
        return count
    })
}

schema.generateCode = async function (args) {
    const { type, prefix = '', start = 8, isPlain = false, increaseCount = 0 } = args

    const count = increaseCount || 1

    const updateCode = await GenerateCode.findOneAndUpdate(
        { type, prefix },
        { $inc: { count: count } },
        { upsert: true, new: true }
    )

    if (isPlain) return updateCode.count

    // return XXXNNNNNNNN => INV00000001 format
    return `${prefix}${String(updateCode.count).padStart(start, '0')}`
}

schema.checkReference = async function (models) {
    return await models.map((model) => (callback) => {
        mongoose
            .model(model.name)
            .findOne({ [model.key]: model.value }, { _id: 1 })
            .exec((error, result) => {
                if (error) {
                    return callback(error, undefined)
                } else {
                    return callback(undefined, result ? 1 : 0)
                }
            })
    })
}

schema.getPaginationQuery = async function (args, isNFilter = true) {
    let page = args.page || {}

    let sort = args.sort || {}
    let filter = args.filter || {}

    let skip = parseInt(page.skip) || 0
    let limit = parseInt(page.limit) || 10

    skip = skip * limit

    for (const i in sort) {
        sort[i] = parseInt(sort[i])
    }

    if (args.created_at) {
        filter['created_at'] = await getDateRange(args.created_at)
    }

    if (isNFilter && args.n_filter) {
        filter['owner_id'] = args.n_filter['owner_id']
    }

    return { sort, filter, skip, limit }
}

schema.getServerSideQuery = async function (args) {
    const {
        start,
        length,
        draw = '1',
        columns = [{ data: '_id' }],
        order = [{ column: 0, dir: 'asc' }],
        search = { value: '', regex: 'false' },
        searchKeys = ['name'], // keys for searching
        isNFilter = true, // filter for account
        created_at, // modal filter
    } = args

    const sort = {}
    const filter = {}
    const w_regx = searchKeys

    const skip = parseInt(start) || 0
    let limit = parseInt(length) || 10

    if (limit === -1) {
        limit = undefined
    }

    if (created_at) {
        filter['created_at'] = await getDateRange(created_at)
    }

    if (isNFilter && args.n_filter) {
        if (args.n_filter['owner_id']) filter['owner_id'] = schema.objectId(args.n_filter['owner_id'])

        // if (args.n_filter['store_id'])
        //     filter['store_id'] = schema.objectId(args.n_filter['store_id'])
    }

    if (order) {
        for (const i in order) {
            sort[columns[i].data] = order[i].dir === 'asc' ? 1 : -1
        }
    } else {
        sort['updated_at'] = -1
    }

    if (search && w_regx.length > 0) {
        for (const i in w_regx) {
            const regx = new RegExp(
                // eslint-disable-next-line no-useless-escape
                search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''),
                'i'
            )
            w_regx[i] = { [w_regx[i]]: { $regex: regx } }
        }
    }

    iamlog.info('Get query params ', {
        filter,
        w_regx,
        sort,
        skip,
        limit,
        draw,
    })

    return {
        filter,
        w_regx,
        sort,
        skip,
        limit,
        draw,
    }
}

const serialize = require('../serializer2')
const StoreSetting = require('@models/mongodb/schemas/store-setting')

const { services } = require('@config/constant')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const service = services.product

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)
    const recordsTotal = await StoreSetting.countDocuments(filter)

    return StoreSetting.find(filter)
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
    return StoreSetting.findById(id).lean().then(serialize)
}

controller.findDataByCode = (codes) => {
    return StoreSetting.find({ barcode: { $in: codes } })
}

controller.findDataBy = async (params) => {
    const { sort, filter, skip, limit } = await getPaginationQuery(params)

    const recordsTotal = await StoreSetting.countDocuments(filter)

    return StoreSetting.find(filter)
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
    if (dataObj.images) {
        dataObj.printing.header_logo = dataObj.images[0]
        delete dataObj.images
    }

    return StoreSetting.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    if (dataObj.images) {
        dataObj.printing.header_logo = dataObj.images ? dataObj.images[0] : dataObj.printing.header_logo
        delete dataObj.images
    }

    return StoreSetting.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    // return StoreSetting.findByIdAndDelete(id).lean().then(serialize)
    return StoreSetting.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

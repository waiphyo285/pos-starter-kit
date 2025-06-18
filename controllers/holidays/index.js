const serialize = require('../serializer2')
const Holiday = require('@models/mongodb/schemas/holiday')

const utils = require('@utils/index')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.holiday

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Holiday.countDocuments(filter)

    return Holiday.find(filter)
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
    return Holiday.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Holiday.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    dataObj.date = new Date(utils.convertDate(dataObj.date, dt_format.date_dmy, dt_format.full_24))
    return Holiday.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.date = new Date(utils.convertDate(dataObj.date, dt_format.date_dmy, dt_format.full_24))
    return Holiday.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    // return Holiday.findByIdAndDelete(id).lean().then(serialize)
    return Holiday.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

const async = require('async')
const serialize = require('../serializer2')
const CouponCode = require('@models/mongodb/schemas/coupon-code')

const utils = require('@utils/index')
const sUtils = require('@utils/index')
const { checkReference } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.coupon_code

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['code']
    params.isNFilter = false

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await CouponCode.countDocuments(filter)

    return CouponCode.find(filter)
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
    return CouponCode.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const populateType = {
        path: 'coupon_type_id',
        model: 'coupon_type',
        select: 'name type',
    }
    const { filter } = await getPaginationQuery(params)

    if (params.promoApply) {
        const totalAmount = params.totalAmount
        const coupon = await CouponCode.findOne({ code: filter.code }).populate(populateType).lean()
        const modifiedData = sUtils.calculateApplyingCoupon(coupon, totalAmount)

        if (typeof modifiedData === 'string') {
            return new Promise((resolve) => {
                resolve({ http_code: 400, message: modifiedData })
            })
        }

        return { data: modifiedData }
    }

    return CouponCode.find(filter).populate(populateType).lean().then(serialize)
}

controller.addData = (dataObj) => {
    dataObj.code = utils.getCouponCode(6)
    dataObj.expired_at = new Date(utils.convertDate(dataObj.expired_at, dt_format.date_dmy, dt_format.full_24))
    return CouponCode.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.expired_at = new Date(utils.convertDate(dataObj.expired_at, dt_format.date_dmy, dt_format.full_24))
    return CouponCode.findByIdAndUpdate(id, dataObj).lean().then(serialize)
}

controller.deleteData = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'coupon_code',
                key: 'coupon_type_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0) {
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })
    }

    // return CouponCode.findByIdAndDelete(id).lean().then(serialize)
    return CouponCode.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

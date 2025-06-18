const utils = require('@utils/index')
const CouponCode = require('@controllers/coupon-codes')
const { handleDatabase } = require('@utils/handlers/response')

const couponCode = (module.exports = {})

couponCode.index = (req, res, next) => {
    const getService = CouponCode.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.show = (req, res, next) => {
    const getService = CouponCode.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.showBy = (req, res, next) => {
    const getService = CouponCode.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.create = (req, res, next) => {
    const getService = CouponCode.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.update = (req, res, next) => {
    const getService = CouponCode.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.delete = (req, res, next) => {
    const getService = CouponCode.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponCode.deleteAll = (req, res, next) => {
    CouponCode.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

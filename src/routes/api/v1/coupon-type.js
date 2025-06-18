const utils = require('@utils/index')
const CouponType = require('@controllers/coupon-types')
const { handleDatabase } = require('@utils/handlers/response')

const couponType = (module.exports = {})

couponType.index = (req, res, next) => {
    const getService = CouponType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.show = (req, res, next) => {
    const getService = CouponType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.showBy = (req, res, next) => {
    const getService = CouponType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.create = (req, res, next) => {
    const getService = CouponType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.update = (req, res, next) => {
    const getService = CouponType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.delete = (req, res, next) => {
    const getService = CouponType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

couponType.deleteAll = (req, res, next) => {
    CouponType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}

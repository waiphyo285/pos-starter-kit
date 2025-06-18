const moment = require('moment')
const { dt_format } = require('@config/constant')

/**
 * Subscription Utils
 */

const sUtils = (module.exports = {})

sUtils.isExpiredSoon = function (subscription) {
    const endDate = moment(subscription.expired_at)
    const diffDay = endDate.diff(moment(), 'days')
    const status = diffDay <= 5 && diffDay >= 0
    return { status: status, days: diffDay, data: subscription }
}

sUtils.validateSubscription = function (subscription) {
    const currentDate = new Date()
    const startDate = new Date(subscription?.started_at)
    const endDate = new Date(subscription?.expired_at)
    return currentDate >= startDate && currentDate <= endDate && subscription.status
}

sUtils.getDateRangeByDuration = function (duration = 1, args) {
    let { endedAt, isRenew = false, type = 'months' } = args

    if (isRenew) {
        endedAt = utils.convertDate(endedAt, 'DD/MM/YYYY hh:mm A', dt_format.full_24)

        const checkEndDate = utils.compareDate(endedAt)

        endedAt =
            checkEndDate == 1 || checkEndDate == -1 ? moment().add(duration, type) : moment(endedAt).add(duration, type)

        return {
            endDate: endedAt.format(dt_format.full_24),
        }
    }

    const startDate = moment()
    const endDate = startDate.clone().add(duration, type)

    return {
        startDate: startDate.format(dt_format.full_24),
        endDate: endDate.format(dt_format.full_24),
    }
}

sUtils.calculateApplyingCoupon = function (coupon, totalAmount) {
    const AMOUNT = 'amount'
    const PERCENT = 'percent'
    const currentDate = new Date()

    if (!coupon) {
        return 'Coupon not found.'
    }

    if (coupon.status === false) {
        return 'Coupon is inactive.'
    }

    if (coupon.max_times <= 0) {
        return 'Coupon has reached maximum usage.'
    }

    if (coupon.expired_at <= currentDate) {
        return 'Coupon has expired.'
    }

    let savingAmount = 0

    if (coupon.coupon_type_id.type === PERCENT) {
        const percentageDiscount = coupon.promo_amount / 100
        savingAmount = totalAmount * percentageDiscount
    }

    if (coupon.coupon_type_id.type === AMOUNT) {
        savingAmount = coupon.promo_amount
    }

    return {
        savingAmount,
        totalPay: totalAmount - savingAmount,
    }
}

const serialize = require('../serializer2')
const Expense = require('@models/mongodb/schemas/expense')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')
const PurchaseInvoice = require('@models/mongodb/schemas/purchase-invoice')
const TopSelling = require('@models/mongodb/schemas/top-selling')

const utils = require('@utils/index')
const { getServerSideQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const controller = (module.exports = {})

controller.listDailySales = async (params) => {
    let timezone = ''

    const { filter, skip, limit, draw } = await getServerSideQuery(params)

    if (params.tz_filter && params.tz_filter['gmt_offset']) {
        timezone = params.tz_filter['gmt_offset'].slice(3)
    }

    const recordsTotal = await SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$_modified_at' },
                    month: { $month: '$_modified_at' },
                    day: { $dayOfMonth: '$_modified_at' },
                },
            },
        },
    ])

    return SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$_modified_at' },
                    month: { $month: '$_modified_at' },
                    day: { $dayOfMonth: '$_modified_at' },
                },
                subtotal_amount: { $sum: '$subtotal_amount' },
                discount_amount: { $sum: '$discount_amount' },
                tax_amount: { $sum: '$tax_amount' },
                total_amount: { $sum: '$total_amount' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                issued_at: {
                    $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: '$_id.day',
                    },
                },
                subtotal_amount: 1,
                discount_amount: 1,
                tax_amount: 1,
                total_amount: 1,
                count: 1,
            },
        },
        {
            $sort: {
                issued_at: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]).then((data) => {
        return serialize({
            data,
            draw,
            recordsTotal: recordsTotal.length || 0,
            recordsFiltered: recordsTotal.length || 0,
        })
    })
}

controller.dailySalesSummary = async (params) => {
    const { filter } = await getServerSideQuery(params)
    const { startDate, endDate } = await utils.getDailyDate(params)

    const funcTotalSales = (callback) => {
        SalesInvoice.aggregate(
            [
                {
                    $match: {
                        created_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$created_at' },
                            month: { $month: '$created_at' },
                            day: { $dayOfMonth: '$created_at' },
                        },
                        count: { $sum: 1 },
                        sale_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        sale_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: '$_id.day',
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalPurchases = (callback) => {
        PurchaseInvoice.aggregate(
            [
                {
                    $match: {
                        purchased_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$purchased_at' },
                            month: { $month: '$purchased_at' },
                            day: { $dayOfMonth: '$purchased_at' },
                        },
                        count: { $sum: 1 },
                        purchase_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        purchase_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: '$_id.day',
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalExpenses = (callback) => {
        Expense.aggregate(
            [
                {
                    $match: {
                        expensed_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$expensed_at' },
                            month: { $month: '$expensed_at' },
                            day: { $dayOfMonth: '$expensed_at' },
                        },
                        count: { $sum: 1 },
                        expense_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        expense_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: '$_id.day',
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    return [funcTotalSales, funcTotalPurchases, funcTotalExpenses, (cb) => cb(undefined, startDate.toDate())]
}

controller.listWeeklySales = async (params) => {
    let timezone = ''

    const { filter, skip, limit, draw } = await getServerSideQuery(params)

    if (params.tz_filter && params.tz_filter['gmt_offset']) {
        timezone = params.tz_filter['gmt_offset'].slice(3)
    }

    const recordsTotal = await SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: '$_modified_at' },
                    week: { $isoWeek: '$_modified_at' },
                },
            },
        },
    ])

    return SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: '$_modified_at' },
                    week: { $isoWeek: '$_modified_at' },
                },
                subtotal_amount: { $sum: '$subtotal_amount' },
                discount_amount: { $sum: '$discount_amount' },
                tax_amount: { $sum: '$tax_amount' },
                total_amount: { $sum: '$total_amount' },
                count: { $sum: 1 },
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]).then((data) => {
        return serialize(
            {
                data,
                draw,
                recordsTotal: recordsTotal.length || 0,
                recordsFiltered: recordsTotal.length || 0,
            },
            services.weekly_sale,
            true
        )
    })
}

controller.weeklySalesSummary = async (params) => {
    const { filter } = await getServerSideQuery(params)
    const { startDate, endDate } = await utils.getWeeklyDate(params)

    const funcTotalSales = (callback) => {
        SalesInvoice.aggregate(
            [
                {
                    $match: {
                        created_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $isoWeekYear: '$created_at' },
                            week: { $isoWeek: '$created_at' },
                        },
                        count: { $sum: 1 },
                        sale_amount: { $sum: '$total_amount' },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalPurchases = (callback) => {
        PurchaseInvoice.aggregate(
            [
                {
                    $match: {
                        purchased_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $isoWeekYear: '$created_at' },
                            week: { $isoWeek: '$created_at' },
                        },
                        count: { $sum: 1 },
                        purchase_amount: { $sum: '$total_amount' },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalExpenses = (callback) => {
        Expense.aggregate(
            [
                {
                    $match: {
                        expensed_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $isoWeekYear: '$created_at' },
                            week: { $isoWeek: '$created_at' },
                        },
                        count: { $sum: 1 },
                        expense_amount: { $sum: '$total_amount' },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    return [funcTotalSales, funcTotalPurchases, funcTotalExpenses, (cb) => cb(undefined, startDate.toDate())]
}

controller.listMonthlySales = async (params) => {
    let timezone = ''

    const { filter, skip, limit, draw } = await getServerSideQuery(params)

    if (params.tz_filter && params.tz_filter['gmt_offset']) {
        timezone = params.tz_filter['gmt_offset'].slice(3)
    }

    const recordsTotal = await SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$_modified_at' },
                    month: { $month: '$_modified_at' },
                },
            },
        },
    ])

    return SalesInvoice.aggregate([
        {
            $match: filter,
        },
        {
            $addFields: {
                modified_at: {
                    $dateToString: {
                        date: '$created_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                        timezone: timezone,
                    },
                },
            },
        },
        {
            $addFields: {
                _modified_at: {
                    $dateFromString: {
                        dateString: '$modified_at',
                        format: '%Y-%m-%dT%H:%M:%S.%L%z',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$_modified_at' },
                    month: { $month: '$_modified_at' },
                },
                subtotal_amount: { $sum: '$subtotal_amount' },
                discount_amount: { $sum: '$discount_amount' },
                tax_amount: { $sum: '$tax_amount' },
                total_amount: { $sum: '$total_amount' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                issued_at: {
                    $dateFromParts: {
                        year: '$_id.year',
                        month: '$_id.month',
                        day: 1,
                    },
                },
                subtotal_amount: 1,
                discount_amount: 1,
                tax_amount: 1,
                total_amount: 1,
                count: 1,
            },
        },
        {
            $sort: {
                issued_at: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]).then((data) => {
        return serialize({
            data,
            draw,
            recordsTotal: recordsTotal.length || 0,
            recordsFiltered: recordsTotal.length || 0,
        })
    })
}

controller.monthlySalesSummary = async (params) => {
    const { filter } = await getServerSideQuery(params)
    const { startDate, endDate } = await utils.getMonthlyDate(params)

    const funcTotalSales = (callback) => {
        SalesInvoice.aggregate(
            [
                {
                    $match: {
                        created_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$created_at' },
                            month: { $month: '$created_at' },
                        },
                        count: { $sum: 1 },
                        sale_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        sale_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalPurchases = (callback) => {
        PurchaseInvoice.aggregate(
            [
                {
                    $match: {
                        purchased_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$purchased_at' },
                            month: { $month: '$purchased_at' },
                        },
                        count: { $sum: 1 },
                        purchase_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        purchase_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    const funcTotalExpenses = (callback) => {
        Expense.aggregate(
            [
                {
                    $match: {
                        expensed_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$expensed_at' },
                            month: { $month: '$expensed_at' },
                        },
                        count: { $sum: 1 },
                        expense_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        expense_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result[0] || {})
                }
            }
        )
    }

    return [funcTotalSales, funcTotalPurchases, funcTotalExpenses, (cb) => cb(undefined, startDate.toDate())]
}

controller.calculateProfitLoss = async (params) => {
    const { filter } = await getServerSideQuery(params)
    const { startDate, endDate } = await utils.getYearlyDate(params)

    const funcTotalSales = (callback) => {
        SalesInvoice.aggregate(
            [
                {
                    $match: {
                        created_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$created_at' },
                            month: { $month: '$created_at' },
                        },
                        count: { $sum: 1 },
                        sale_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        sale_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
                {
                    $sort: {
                        issued_at: -1,
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result)
                }
            }
        )
    }

    const funcTotalPurchases = (callback) => {
        PurchaseInvoice.aggregate(
            [
                {
                    $match: {
                        purchased_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$purchased_at' },
                            month: { $month: '$purchased_at' },
                        },
                        count: { $sum: 1 },
                        purchase_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        purchase_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
                {
                    $sort: {
                        issued_at: -1,
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result)
                }
            }
        )
    }

    const funcTotalExpenses = (callback) => {
        Expense.aggregate(
            [
                {
                    $match: {
                        expensed_at: {
                            $gte: startDate.toDate(),
                            $lt: endDate.toDate(),
                        },
                        ...filter,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$expensed_at' },
                            month: { $month: '$expensed_at' },
                        },
                        count: { $sum: 1 },
                        expense_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        expense_amount: 1,
                        issued_at: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: 1,
                            },
                        },
                    },
                },
                {
                    $sort: {
                        issued_at: -1,
                    },
                },
            ],
            (err, result) => {
                if (err) {
                    callback(err, undefined)
                } else {
                    callback(undefined, result)
                }
            }
        )
    }

    return [funcTotalSales, funcTotalPurchases, funcTotalExpenses, (cb) => cb(undefined, startDate.toDate())]
}

controller.getTopSalesItems = async (params) => {
    const { filter } = await getServerSideQuery(params)
    const { startDate: startDateM, endDate: endDateM } = await utils.getMonthlyDate(params)
    const { startDate: startDateY, endDate: endDateY } = await utils.getYearlyDate(params)

    const funcCurrentMonth = (callback) => {
        TopSelling.find({
            ...filter,
            created_at: {
                $gte: startDateM.toDate(),
                $lt: endDateM.toDate(),
            },
        })
            .lean()
            .exec((err, result) => {
                if (err) return callback(err)
                callback(null, result)
            })
    }

    const funcCurrentYear = (callback) => {
        TopSelling.find({
            ...filter,
            created_at: {
                $gte: startDateY.toDate(),
                $lt: endDateY.toDate(),
            },
        })
            .lean()
            .exec((err, result) => {
                if (err) return callback(err)
                callback(null, result)
            })
    }

    return [funcCurrentMonth, funcCurrentYear]
}

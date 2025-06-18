const express = require('express')
const router = express.Router()
const moment = require('moment')
const async = require('async')
const utils = require('@utils/index')
const config = require('@config/env')
const checkAuth = require('@middleware/dto/is-valid-user')
const { getProgram } = require('@utils/handlers/access-user')
const { getContent } = require('@utils/handlers/get-content')
const { dt_format } = require('@config/constant')

// Import Models
const Customer = require('@models/mongodb/schemas/customer')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')

const generateDateRange = (startDate, endDate) => {
    const dates = []
    const currentDate = moment(startDate)

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        dates.push(currentDate.toISOString())
        currentDate.add(1, 'day')
    }

    return dates
}

const fillMissingData = (dateRange, data) => {
    return dateRange.map((date) => {
        const matchData = data.find((item) => moment(item.issued_at).isSame(date, 'day'))

        return matchData
            ? {
                  ...matchData,
                  issued_at: utils.convertDate(matchData.issued_at, dt_format.full_24, dt_format.date_dmy),
              }
            : {
                  total_item: 0,
                  total_amount: 0,
                  issued_at: utils.convertDate(date, dt_format.full_24, dt_format.date_dmy),
              }
    })
}

const dashboardCard = async (params) => {
    let filter = {}

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
                    $unwind: '$order_items',
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$created_at' },
                            month: { $month: '$created_at' },
                            day: { $dayOfMonth: '$created_at' },
                        },
                        total_invoice: { $sum: 1 },
                        total_amount: { $sum: '$total_amount' },
                        total_item: { $sum: '$order_items.quantity' }, //
                    },
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        total_invoice: 1,
                        total_amount: 1,
                        total_item: 1,
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

    const funcTotalCustomers = (callback) => {
        Customer.aggregate(
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
                        _id: null,
                        total_customer: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        total_customer: 1,
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

    const { startDate: startDate2, endDate: endDate2 } = await utils.getLast7Day(params)

    const funcLast7DaySales = (callback) => {
        SalesInvoice.aggregate(
            [
                {
                    $match: {
                        created_at: {
                            $gte: startDate2.toDate(),
                            $lt: endDate2.toDate(),
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
                        total_item: { $sum: 1 },
                        total_amount: { $sum: '$total_amount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        total_amount: 1,
                        total_item: 1,
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
                    callback(undefined, {
                        result: result,
                        startDate: startDate2.toDate(),
                        endDate: endDate2.toDate(),
                    })
                }
            }
        )
    }

    return [funcTotalSales, funcTotalCustomers, funcLast7DaySales]
}

router.get('/', checkAuth, async (req, res) => {
    const currentUser = req.user
    const reqQuery = req.query

    async.parallel(await dashboardCard(reqQuery), async function (error, results) {
        const curUserProgram = await getProgram(currentUser, 'dashboard.null.null')
        const getPageContent = await getContent(currentUser.locale, 'dashboard', [])

        const cardResult = results.slice(0, 2).reduce((acc, obj) => {
            return { ...acc, ...obj }
        }, {})

        const barchartResult = fillMissingData(
            generateDateRange(results.slice(2)[0].startDate, results.slice(2)[0].endDate),
            results.slice(2)[0].result
        )

        res.render('pages/dashboard', {
            ...curUserProgram,
            app: config.APP,
            data: {
                card: cardResult,
                barchart: barchartResult,
            },
            content: getPageContent,
        })
    })
})

module.exports = router

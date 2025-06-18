const express = require('express')
const router = express.Router()
const async = require('async')
const utils = require('@utils/index')
const Reporting = require('@controllers/reportings')
const checkAuth = require('@middleware/dto/is-valid-user')
const { handleRenderer } = require('@utils/handlers/response')
const { dt_format } = require('@config/constant')

function transformYearlyResult(dimension, defaultObj) {
    if (dimension.length === 0) {
        return []
    }

    const transformResult = new Map()

    dimension.forEach((innerArr) => {
        innerArr.forEach((innerObj) => {
            const { issued_at, ...rest } = innerObj
            const issuedAtDate = new Date(issued_at)

            if (!isNaN(issuedAtDate)) {
                const currentKey = issuedAtDate.getMonth()
                const currentRow = transformResult.get(currentKey) || {
                    issued_at,
                }
                transformResult.set(currentKey, { ...currentRow, ...rest })
            }
        })
    })

    return Array.from(transformResult.values()).map((obj) => ({
        ...defaultObj,
        ...obj,
    }))
}

router
    .get('/daily-sales', checkAuth, async (req, res) => {
        async.parallel(await Reporting.dailySalesSummary(req.query), async function (error, results) {
            const sales = results[0].sale_amount || 0
            const purchases = results[1].purchase_amount || 0
            const expenses = results[2].expense_amount || 0
            const profits = sales - (purchases + expenses)

            const pages = {
                data: {
                    sales: utils.nFormatter(sales),
                    purchases: utils.nFormatter(purchases),
                    expenses: utils.nFormatter(expenses),
                    profits: utils.nFormatter(profits),
                    cur_day: utils.convertDate(results[3], dt_format.full_24, dt_format.date_dmy),
                },
                runPage: 'pages/reportings/daily-sales',
                runProgram: 'reporting.daily_sale.list',
                runContent: 'reporting.daily_sale',
            }
            handleRenderer(req.user, pages, res)
        })
    })
    .get('/weekly-sales', checkAuth, async (req, res) => {
        async.parallel(await Reporting.weeklySalesSummary(req.query), async function (error, results) {
            const sales = results[0].sale_amount || 0
            const purchases = results[1].purchase_amount || 0
            const expenses = results[2].expense_amount || 0
            const profits = sales - (purchases + expenses)

            const { week, year } = utils.getDateInfo(results[3])

            const pages = {
                data: {
                    sales: utils.nFormatter(sales),
                    purchases: utils.nFormatter(purchases),
                    expenses: utils.nFormatter(expenses),
                    profits: utils.nFormatter(profits),
                    cur_week: `Week ${week}, ${year}`,
                    cur_week_detail: utils.getWeekDateRange(year, week),
                },
                runPage: 'pages/reportings/weekly-sales',
                runProgram: 'reporting.weekly_sale.list',
                runContent: 'reporting.weekly_sale',
            }
            handleRenderer(req.user, pages, res)
        })
    })
    .get('/monthly-sales', checkAuth, async (req, res) => {
        async.parallel(await Reporting.monthlySalesSummary(req.query), async function (error, results) {
            const sales = results[0].sale_amount || 0
            const purchases = results[1].purchase_amount || 0
            const expenses = results[2].expense_amount || 0
            const profits = sales - (purchases + expenses)

            const pages = {
                data: {
                    sales: utils.nFormatter(sales),
                    purchases: utils.nFormatter(purchases),
                    expenses: utils.nFormatter(expenses),
                    profits: utils.nFormatter(profits),
                    cur_month: utils.convertDate(results[3], dt_format.full_24, dt_format.date_dmy),
                },
                runPage: 'pages/reportings/monthly-sales',
                runProgram: 'reporting.monthly_sale.list',
                runContent: 'reporting.monthly_sale',
            }
            handleRenderer(req.user, pages, res)
        })
    })
    .get('/yearly-profit-loss', checkAuth, async (req, res) => {
        async.parallel(await Reporting.calculateProfitLoss(req.query), async function (error, results) {
            const transResults = transformYearlyResult(results.slice(0, 3), {
                count: 0,
                sale_amount: 0,
                purchase_amount: 0,
                expense_amount: 0,
            })

            const sales = transResults[0]?.sale_amount || 0
            const purchases = transResults[0]?.purchase_amount || 0
            const expenses = transResults[0]?.expense_amount || 0
            const profits = sales - (purchases + expenses)

            const { year } = utils.getDateInfo(results[3])

            const pages = {
                data: {
                    sales: utils.nFormatter(sales),
                    purchases: utils.nFormatter(purchases),
                    expenses: utils.nFormatter(expenses),
                    profits: utils.nFormatter(profits),
                    cur_year: `Year ${year}`,
                    data_list: transResults,
                },
                runPage: 'pages/reportings/yearly-profit-loss',
                runProgram: 'reporting.yearly_profit_loss.list',
                runContent: 'reporting.yearly_profit_loss',
            }
            handleRenderer(req.user, pages, res)
        })
    })
    .get('/top-sales-items', checkAuth, async (req, res) => {
        async.parallel(await Reporting.getTopSalesItems(req.query), async function (error, results) {
            const curMonthResults = results[0].map((item) => ({
                ...item,
                date: utils.convertDate(item.created_at, dt_format.full_24, dt_format.date_dmy),
            }))

            const curYearResults = results[0].map((item) => ({
                ...item,
                date: utils.convertDate(item.created_at, dt_format.full_24, dt_format.date_dmy),
            }))

            const pages = {
                data: {
                    cur_month_results: curMonthResults,
                    cur_year_results: curYearResults,
                },
                runPage: 'pages/reportings/top-sales-items',
                runProgram: 'reporting.top_sales_items.list',
                runContent: 'reporting.top_sales_items',
            }
            handleRenderer(req.user, pages, res)
        })
    })

module.exports = router

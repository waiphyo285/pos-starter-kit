const fs = require('fs')
const path = require('path')
const moment = require('moment')
const pluralize = require('pluralize')
const timezone = require('@config/timezone')
const { dt_format } = require('@config/constant')

/**
 * Utils Functions
 */

const utils = (module.exports = {})

utils.isEmpty = function (val) {
    return val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length === 0)
}

utils.isEmptyString = function (str) {
    return str === '' || str === null || str === undefined
}

utils.isEmptyNumber = function (num) {
    return typeof num !== 'number' || isNaN(num)
}

utils.isEmptyObject = function (obj) {
    return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0)
}

utils.isEmptyArray = function (arr) {
    return !Array.isArray(arr) || arr.length === 0
}

utils.isArray = function (arr) {
    return Array.isArray(arr)
}

utils.isEmail = function (email) {
    // eslint-disable-next-line no-useless-escape
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return email.match(regex) ? true : false
}

utils.getTimeZone = function (utc = '+06:30') {
    return timezone.find((tz) => tz.utc === utc)
}

utils.toPluralize = function (str) {
    return pluralize(str)
}

utils.toCamelCase = function (str) {
    return str
        .replace(/\s(.)/g, ($1) => $1.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/, ($1) => $1.toLowerCase())
}

utils.toTitleCase = function (str, splitWith, joinWith) {
    return str
        .split(splitWith)
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(joinWith)
}

utils.getCouponCode = function (length = 8) {
    let couponCode = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        couponCode += characters.charAt(randomIndex)
    }

    return couponCode
}

utils.getPreviousDate = function () {
    const startDate = moment().utc().subtract(1, 'days').startOf('day')
    const endDate = moment().utc().subtract(1, 'days').endOf('day')

    return { startDate, endDate }
}

utils.getDailyDate = function (args) {
    const { diff_hours } = args.tz_filter

    const startDate = moment().utc().startOf('day').add(diff_hours, 'hours') // Today at midnight
    const endDate = moment().utc().endOf('day').add(diff_hours, 'hours') // Today at 23:59:59

    return { startDate, endDate }
}

utils.getLast7Day = function (args) {
    const { diff_hours } = args.tz_filter

    const endDate = moment().utc().endOf('day').add(diff_hours, 'hours')
    const startDate = moment(endDate).subtract(6, 'days').startOf('day')

    return { startDate, endDate }
}

utils.getWeeklyDate = function (args) {
    const { diff_hours } = args.tz_filter

    const startDate = moment().utc().startOf('isoWeek').add(diff_hours, 'hours') // First day of the current ISO week at midnight
    const endDate = moment().utc().endOf('isoWeek').add(diff_hours, 'hours') // Last day of the current ISO week at 23:59:59

    return { startDate, endDate }
}

utils.getMonthlyDate = function (args) {
    const { diff_hours } = args.tz_filter

    const startDate = moment().utc().startOf('month').add(diff_hours, 'hours') // First day of the current month at midnight
    const endDate = moment().utc().endOf('month').add(diff_hours, 'hours') // Last day of the current month at 23:59:59

    return { startDate, endDate }
}

utils.getYearlyDate = function (args) {
    const { diff_hours } = args.tz_filter

    const startDate = moment().utc().startOf('year').add(diff_hours, 'hours') // First day of the current year at midnight
    const endDate = moment().utc().endOf('year').add(diff_hours, 'hours') // Last day of the current year at 23:59:59

    return { startDate, endDate }
}

utils.getDateRange = async function (args) {
    return {
        $gte: args.gte ? new Date(moment(args.gte, [dt_format.date_dmy]).format('YYYY-MM-D')) : new Date('1900-01-01'),
        $lte: args.lt ? new Date(moment(args.lt, [dt_format.date_dmy]).format('YYYY-MM-D')) : new Date(),
    }
}

utils.getWeekDateRange = function (year = 1970, week = 1, format = dt_format.date_dmy) {
    const startDate = moment().year(year).isoWeek(week).startOf('isoWeek')
    const endDate = moment().year(year).isoWeek(week).endOf('isoWeek')
    return `${startDate.format(format)} - ${endDate.format(format)}`
}

utils.getDateInfo = function (date = new Date()) {
    const mmDate = moment(date)
    return {
        day: mmDate.format('dddd'),
        week: mmDate.isoWeek(),
        month: mmDate.format('MMMM'),
        year: mmDate.year(),
        dayOfWeek: mmDate.format('d'),
        dayOfMonth: mmDate.date(),
        quarter: Math.ceil(mmDate.month() / 3),
        isWeekend: mmDate.isoWeekday() > 5,
        isLeapYear: mmDate.isLeapYear(),
        isSameDay: (compDate) => mmDate.isSame(compDate, 'day'),
        isSameMonth: (compDate) => mmDate.isSame(compDate, 'month'),
        isSameYear: (compDate) => mmDate.isSame(compDate, 'year'),
    }
}

utils.convertDate = function (date = new Date(), from = dt_format.full_24, to = 'DD/MM/YYYY hh:mm A') {
    const parsedDate = moment(date, from)

    if (!parsedDate.isValid()) {
        throw new Error(`Invalid date or format: ${date} ${to}`)
    }

    return parsedDate.format(to)
}

utils.compareDate = function (date1, date2 = new Date()) {
    const momentDate1 = moment(date1)
    const momentDate2 = moment(date2)

    if (!momentDate1.isValid() || !momentDate2.isValid()) {
        return -1
    }

    switch (true) {
        case momentDate1.isBefore(momentDate2):
            return 1 // date1 (provided) < date2 (new Date)
        case momentDate1.isAfter(momentDate2):
            return 2 // date1 (provided) > date2 (new Date)
        default:
            return -1
    }
}

utils.removeImages = function (images) {
    return new Promise((resolve, reject) => {
        if (!images || images.length === 0) {
            return resolve()
        }

        const unlinkImagePromises = images.map((file) => {
            return new Promise((resolve, reject) => {
                const filePath = path.join(__dirname, 'public', file.replace(/\\/g, '/'))

                fs.access(filePath, fs.constants.F_OK, (accessErr) => {
                    if (accessErr) {
                        return resolve()
                    }

                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) return reject(unlinkErr)
                        resolve()
                    })
                })
            })
        })

        Promise.all(unlinkImagePromises)
            .then(() => resolve())
            .catch((err) => reject(err))
    })
}

utils.nFormatter = function (num, digits) {
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/

    const sign = num < 0 ? '-' : ''
    const absoluteNum = Math.abs(num)

    const item = lookup
        .slice()
        .reverse()
        .find((item) => absoluteNum >= item.value)

    return item ? sign + (absoluteNum / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

utils.merge2Array = function (arr1, arr2, key1, key2) {
    if (arr1.length !== arr2.length) return []

    const map = new Map(arr1.map((item) => [String(item[key1]), item]))

    return arr2.map((item) => {
        const relatedItem = map.get(String(item[key2]))
        return relatedItem ? { ...relatedItem, ...item } : item
    })
}

utils.convertGMTOffset = function (offsetMin) {
    const sign = offsetMin < 0 ? '+' : '-'
    let hours = Math.floor(Math.abs(offsetMin) / 60)
    let minutes = Math.abs(offsetMin) % 60

    hours = hours.toString().padStart(2, '0')
    minutes = minutes.toString().padStart(2, '0')

    return `GMT${sign}${hours}:${minutes}`
}

utils.gmtToNumeric = function (gmtFormat) {
    const regex = /^GMT([+-])(\d{2}):?(\d{2})$/
    const match = gmtFormat.match(regex)

    if (match) {
        const sign = match[1] === '+' ? -1 : 1
        const hours = parseInt(match[2], 10)
        const minutes = match[3] ? parseInt(match[3], 10) : 0
        const totalOffset = sign * (hours + minutes / 60)

        return totalOffset
    }

    return null
}

utils.roundAmount = function (amount, method) {
    const precision = 0.01 // Always use 0.01 as precision
    switch (method) {
        case 'up':
            return Math.ceil(amount / precision) * precision
        case 'down':
            return Math.floor(amount / precision) * precision
        case 'nearest':
            return Math.round(amount / precision) * precision
        default:
            return amount
    }
}

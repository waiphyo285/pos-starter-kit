const serialize = require('../serializer2')
const Expense = require('@models/mongodb/schemas/expense')

const utils = require('@utils/index')
const { generateCode } = require('@utils/schema')
const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const service = services.expense

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['invoice_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Expense.countDocuments(filter)

    return Expense.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .then((data) => {
            return serialize({
                data,
                draw,
                recordsTotal,
                recordsFiltered: recordsTotal,
            })
        })
}

controller.findDataById = (id) => {
    return Expense.findById(id)
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Expense.find(filter).then(serialize)
}

controller.addData = async (dataObj) => {
    dataObj.invoice_no = await generateCode({ type: 'expense', prefix: 'EXP' })
    dataObj.expensed_at = new Date(utils.convertDate(dataObj.expensed_at, dt_format.date_dmy, dt_format.full_24))
    return Expense.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    dataObj.expensed_at = new Date(utils.convertDate(dataObj.expensed_at, dt_format.date_dmy, dt_format.full_24))
    return Expense.findByIdAndUpdate(id, dataObj).then(serialize)
}

controller.deleteData = (id) => {
    // return Expense.findByIdAndDelete(id).then(serialize)
    return Expense.deleteById(id).then(serialize) // softdelete
}

controller.ropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

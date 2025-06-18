const serialize = require('../serializer2')
const Variant = require('@models/mongodb/schemas/variant')
const CouponCode = require('@models/mongodb/schemas/coupon-code')
const SaleOrder = require('@models/mongodb/schemas/sale-order')
const AccReceivable = require('@models/mongodb/schemas/acc-receivable')
const SalesInvoice = require('@models/mongodb/schemas/sale-invoice')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.sale_order

const controller = (module.exports = {})

controller.listData = async (params) => {
    params.searchKeys = ['order_no']

    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await SaleOrder.countDocuments(filter)

    return SaleOrder.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .then((data) => {
            return serialize(
                {
                    data,
                    draw,
                    recordsTotal,
                    recordsFiltered: recordsTotal,
                },
                service
            )
        })
}

controller.findDataById = (id) => {
    return SaleOrder.findById(id)
        .populate({
            path: 'order_items.item_id',
            model: 'variant',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return SaleOrder.find(filter)
        .lean()
        .then((data) => serialize(data, service))
}

controller.addData = async (dataObj) => {
    if (dataObj._id) {
        return SaleOrder.findByIdAndUpdate(dataObj._id, dataObj)
            .lean()
            .then((data) => serialize(data, service))
    } else {
        return SaleOrder.create(dataObj).then((data) => serialize(data, service))
    }
}

controller.updateData = async (id, dataObj) => {
    if (dataObj.remove) {
        return SaleOrder.findByIdAndDelete(id)
            .lean()
            .then(() => serialize({ remove: true }, service))
    }
    return SaleOrder.findByIdAndUpdate(id, dataObj)
        .lean()
        .then((data) => serialize(data, service))
}

controller.makePayment = async (id, dataObj) => {
    let result

    return SalesInvoice.create(dataObj)
        .then(async (data) => {
            result = data
            const updateOps = data.order_items.map((orderItem) => {
                const itemId = orderItem.item_id
                const quantity = orderItem.quantity
                return {
                    updateOne: {
                        filter: { _id: itemId },
                        update: { $inc: { stock: -quantity } },
                    },
                }
            })
            return Variant.bulkWrite(updateOps)
        })
        .then((_data) => {
            const couponCode = dataObj.promo_code
            return CouponCode.findOneAndUpdate(
                { code: couponCode },
                { $inc: { max_times: -1, current_times: 1 } },
                { new: true }
            )
        })
        .then((_data) => {
            const {
                _id: invoice_id,
                owner_id,
                store_id,
                customer_id,
                total_amount: due_amount,
                created_at: due_date,
                state,
            } = result
            return AccReceivable.create({
                owner_id,
                store_id,
                invoice_id,
                customer_id,
                state,
                due_amount,
                due_date,
            })
        })
        .then((_data) => {
            return findDataByOrderNo(dataObj.order_no)
        })
}

controller.deleteData = (id) => {
    return SaleOrder.findByIdAndDelete(id)
        .lean()
        .then((data) => serialize(data, service))
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

// local functions

const findDataByOrderNo = (order_no) => {
    return SalesInvoice.findOne({ order_no })
        .populate({
            path: 'order_items.item_id',
            model: 'variant',
            select: 'name',
        })
        .populate({
            path: 'staff_id',
            model: 'staff',
            select: 'name email description',
        })
        .populate({
            path: 'customer_id',
            model: 'customer',
            select: 'name phone_1 phone_2 address description',
        })
        .populate({
            path: 'paymethod_id',
            model: 'bank',
            select: 'name',
        })
        .lean()
        .then((data) => serialize(data, service, true))
}

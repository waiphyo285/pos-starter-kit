const utils = require('@utils/index')
const { objectId } = require('@utils/schema')
const { generateCode } = require('@utils/schema')

const Variant = require('@models/mongodb/schemas/variant')
const SaleOrder = require('@models/mongodb/schemas/sale-order')
const { createResponse } = require('@utils/handlers/response')

const prev = (data, locales, res) => {
    res.status(422).json(createResponse(422, { data }, locales))
}

const checkStockNewCart = async (req, res, next) => {
    let isOutOfStock = false
    const dataObj = req.body
    const accObj = req.query.n_filter
    const locales = res.locals.i18n.translations

    const isValidObj = utils.isEmptyObject(dataObj) || utils.isEmptyObject(accObj)

    if (isValidObj) {
        return prev({ message: 'Should not be empty object' }, locales, res)
    }

    const selectFields =
        'name stock wholesale_price retail_price discount_method discount_amount tax_method tax_percent'
    const item = await Variant.findById(dataObj.item_id, selectFields).lean()

    if (!dataObj.cart_id && item) {
        isOutOfStock = item.stock <= 0

        if (isOutOfStock) {
            return prev({ message: 'Your item is out of stock' }, locales, res)
        }

        const itemAmount = item.retail_price
        const itemDiscount = item.discount_amount
        const itemTax = item.tax_method === 'exclusive' ? item.retail_price * (item.tax_percent / 100) : 0 // (inclusive) no need to include tax amount

        const cartObj = {
            owner_id: accObj.owner_id,
            store_id: accObj.store_id,
            staff_id: accObj.staff_id,
            order_no: await generateCode({ type: 'sale_order', prefix: 'ORD' }),
            order_items: [
                {
                    quantity: 1,
                    item_id: item._id,
                    tax_amount: itemTax,
                    subtotal_amount: itemAmount,
                    discount_amount: itemDiscount,
                    total_amount: itemAmount + itemTax - itemDiscount,
                },
            ],
            tax_amount: itemTax,
            subtotal_amount: itemAmount,
            discount_amount: itemDiscount,
            total_amount: itemAmount + itemTax - itemDiscount,
        }

        req.body = cartObj

        return next()
    }

    if (dataObj.cart_id && item) {
        const omitFields = '-order_no -remark -created_at -updated_at'

        const cart = await SaleOrder.findById(dataObj.cart_id, omitFields).lean()

        if (utils.isEmptyObject(cart)) {
            return prev({ message: 'Order cart is not found' }, locales, res)
        }

        let isExistedItem = false
        const itemAmount = item.retail_price
        const itemDiscount = item.discount_amount
        const itemTax = item.tax_method === 'exclusive' ? item.retail_price * (item.tax_percent / 100) : 0 // (inclusive) no need to include tax amount

        const editedItems = cart.order_items.map((order_item) => {
            if (String(order_item.item_id) == String(item._id)) {
                let newTotal = 0
                let newTaxTotal = 0
                let newDisTotal = 0
                let newQuantity = order_item.quantity + 1
                let newSubTotal = itemAmount * newQuantity

                newTaxTotal = itemTax > 0 ? itemTax * newQuantity : 0
                newDisTotal = itemDiscount > 0 ? itemDiscount * newQuantity : 0

                newTotal = newSubTotal + newTaxTotal

                if (newDisTotal > 0 && newSubTotal > newDisTotal) {
                    newTotal = newTotal - newDisTotal
                }

                order_item = {
                    ...order_item,
                    quantity: newQuantity,
                    tax_amount: newTaxTotal,
                    subtotal_amount: newSubTotal,
                    discount_amount: newDisTotal,
                    total_amount: newTotal,
                }

                isExistedItem = true
                isOutOfStock = item.stock < newQuantity
            }

            return order_item
        })

        if (!isExistedItem) {
            const newItem = {
                quantity: 1,
                item_id: item._id,
                tax_amount: itemTax,
                subtotal_amount: itemAmount,
                discount_amount: itemDiscount,
                total_amount: itemAmount + itemTax - itemDiscount,
            }

            isOutOfStock = item.stock <= 0

            editedItems.push(newItem)
        }

        if (isOutOfStock) {
            return prev({ message: 'Your item(s) is out of stock' }, locales, res)
        }

        const editedCart = editedItems.reduce(
            (acc, cur) => {
                acc.tax_amount += cur.tax_amount
                acc.subtotal_amount += cur.subtotal_amount
                acc.discount_amount += cur.discount_amount
                acc.total_amount += cur.total_amount
                return acc
            },
            {
                ...cart,
                tax_amount: 0,
                subtotal_amount: 0,
                discount_amount: 0,
                total_amount: 0,
                order_items: editedItems,
            }
        )

        req.body = editedCart

        return next()
    }

    return prev({ message: 'Unable to proceed your request' }, locales, res)
}

const checkStockUpdateCart = async (req, res, next) => {
    const dataObj = req.body
    const cartId = req.params.id
    const orderItems = dataObj.order_items
    const locales = res.locals.i18n.translations

    if (orderItems === undefined) {
        req.body = { remove: true }
        return next()
    }

    const cart = await SaleOrder.findById(cartId).lean()

    if (utils.isEmptyObject(cart)) {
        return prev({ message: 'Order cart is not found' }, locales, res)
    }

    const ignoreFields = '-images -attribute_variant -attribute_price'
    const itemIds = orderItems.map((item) => objectId(item.item_id))
    const items = await Variant.find({ _id: { $in: itemIds } }, ignoreFields).lean()

    const mergeItems = utils.merge2Array(items, orderItems, '_id', 'item_id')

    cart.tax_amount = 0
    cart.subtotal_amount = 0
    cart.discount_amount = 0
    cart.total_amount = 0

    let warningMessage = ''

    let newCart = mergeItems.reduce((acc, cur) => {
        const originItemIdx = acc.order_items.findIndex((item) => item.item_id == cur.item_id)

        if (originItemIdx !== -1) {
            let newTotal = 0
            const itemAmount = cur.retail_price
            const itemDiscount = cur.discount_amount

            const newQuantity = Number(cur.quantity)
            const newSubTotal = itemAmount * newQuantity
            const newTaxTotal =
                (cur.tax_method === 'exclusive' ? itemAmount * (cur.tax_percent / 100) : 0) * newQuantity

            const newDisTotal = itemDiscount > 0 ? itemDiscount * newQuantity : 0

            newTotal =
                newDisTotal > 0 && newSubTotal > newDisTotal
                    ? newSubTotal + newTaxTotal - newDisTotal
                    : newSubTotal + newTaxTotal

            acc.order_items[originItemIdx] = {
                ...acc.order_items[originItemIdx],
                quantity: newQuantity,
                tax_amount: newTaxTotal,
                subtotal_amount: newSubTotal,
                discount_amount: newDisTotal,
                total_amount: newTotal,
                found_item: true,
            }

            acc.tax_amount = acc.tax_amount + newTaxTotal
            acc.subtotal_amount = acc.subtotal_amount + newSubTotal
            acc.discount_amount = acc.discount_amount + newDisTotal
            acc.total_amount = acc.total_amount + newTotal

            if (cur.stock < newQuantity) {
                warningMessage += `${cur.name} (${cur.stock}) \n`
            }
        }

        return acc
    }, cart)

    if (warningMessage) {
        return prev({ message: `Out of stock: ${warningMessage}` }, locales, res)
    }

    newCart.order_items = newCart.order_items.filter((item) => item.found_item)
    req.body = newCart

    return next()
}

const checkStockProceedCart = async (req, res, next) => {
    const dataObj = req.body
    const cartId = req.params.id
    const locales = res.locals.i18n.translations

    let warningMessage = ''
    const ignoreFields = '-_id -state -created_at -updated_at'
    const selectFields = 'name barcode barcode_sym retail_price wholesale_price cost stock'

    const cart = await SaleOrder.findById(cartId)
        .select(ignoreFields)
        .populate({
            path: 'order_items.item_id',
            select: selectFields,
        })
        .lean()

    if (utils.isEmptyObject(cart)) {
        return prev({ message: 'Order cart is not found' }, locales, res)
    }

    cart.order_items = cart.order_items.map((item) => {
        const { _id, ...rest } = item.item_id

        delete item.item_id

        if (rest.stock < item.quantity) {
            warningMessage += `${cur.name} (${cur.stock}) \n`
        }

        return { ...item, ...rest, item_id: _id }
    })

    if (warningMessage) {
        return prev({ message: `Out of stock: ${warningMessage}` }, locales, res)
    }

    req.body = {
        ...cart,
        ...dataObj,
        state: 'paid',
        invoice_no: await generateCode({ type: 'sale_invoice', prefix: 'SAI' }),
    }

    return next()
}

const checkStockSaleOrder = async (req, res, next) => {
    let isOutOfStock = false
    const dataObj = req.body
    const orderItems = dataObj.order_items
    const locales = res.locals.i18n.translations

    const isValidObj = utils.isEmptyObject(dataObj) || utils.isEmptyArray(orderItems)

    if (isValidObj) {
        return prev({ message: 'Should not be empty object' }, locales, res)
    }

    const selectFields =
        'name stock wholesale_price retail_price discount_method discount_amount tax_method tax_percent'

    const items = await Variant.find()
        .where('_id')
        .in(orderItems.map((item) => item.item_id))
        .select(selectFields)
        .lean()

    if (!utils.isEmptyArray(items)) {
        const editedItems = []

        for (const i of orderItems) {
            const findItem = items.find((item) => item._id == i.item_id)

            if (findItem && findItem.stock >= i.quantity) {
                const quantity = i.quantity
                const itemAmount = findItem.retail_price
                const itemDiscount = findItem.discount_amount
                const itemTax =
                    findItem.tax_method === 'exclusive' ? findItem.retail_price * (findItem.tax_percent / 100) : 0 // (inclusive) no need to include tax amount

                editedItems.push({
                    quantity: quantity,
                    item_id: findItem._id,
                    tax_amount: itemTax * quantity,
                    subtotal_amount: itemAmount * quantity,
                    discount_amount: itemDiscount * quantity,
                    total_amount: (itemAmount + itemTax - itemDiscount) * quantity,
                })
            } else {
                isOutOfStock = true
            }
        }

        if (isOutOfStock) {
            return prev({ message: 'Your item(s) is out of stock' }, locales, res)
        }

        const cart = {
            owner_id: dataObj.owner_id,
            store_id: dataObj.store_id,
            staff_id: dataObj.staff_id,
            order_no: await generateCode({ type: 'sale_order', prefix: 'ORD' }),
            state: 'accepted',
        }

        const editedCart = editedItems.reduce(
            (acc, cur) => {
                acc.tax_amount += cur.tax_amount
                acc.subtotal_amount += cur.subtotal_amount
                acc.discount_amount += cur.discount_amount
                acc.total_amount += cur.total_amount
                return acc
            },
            {
                ...cart,
                tax_amount: 0,
                subtotal_amount: 0,
                discount_amount: 0,
                total_amount: 0,
                order_items: editedItems,
            }
        )

        req.body = editedCart

        return next()
    }

    return prev({ message: 'Unable to proceed your request' }, locales, res)
}

module.exports = {
    checkStockNewCart,
    checkStockUpdateCart,
    checkStockProceedCart,
    checkStockSaleOrder,
}

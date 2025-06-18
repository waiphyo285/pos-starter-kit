const { isArray, nFormatter, convertDate, getWeekDateRange } = require('@utils/index')
const { services } = require('@config/constant')
const { dt_format } = require('@config/constant')

const single = (dataObj, service, change) => {
    if (change) {
        switch (service) {
            case services.user:
                // eslint-disable-next-line no-case-declarations
                let showObj = {
                    level: 'Undefined',
                    created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                }

                if (dataObj.level_id) {
                    showObj = {
                        level: dataObj.level_id.level,
                    }
                }

                return {
                    ...dataObj,
                    ...showObj,
                }

            case services.app_config:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    preference: JSON.parse(dataObj.preference) || {},
                }

            case services.store_type:
            case services.employee_type:
            case services.supplier_type:
            case services.customer_type:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                }

            case services.owner:
                return {
                    ...dataObj,
                    owner_type: dataObj.owner_type_id?.name || '-',
                }

            case services.store:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_type: dataObj.store_type_id?.name || '-',
                }

            case services.employee:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                    staff_type: dataObj.staff_type_id?.name || '-',
                }

            case services.customer:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                    customer_type: dataObj.customer_type_id?.name || '-',
                    email: dataObj.email || '-',
                    phone_1: dataObj.phone_1 || '-',
                }

            case services.supplier:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                    supplier_type: dataObj.supplier_type_id?.name || '-',
                }

            case services.township:
                return {
                    ...dataObj,
                    city_mm: dataObj.cityid?.city_mm || '-',
                }

            case services.category:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                }

            case services.sub_category:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    category: dataObj.category_id?.name || '-',
                }

            case services.product:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                    category: dataObj.category_id?.name || '-',
                    sub_category: dataObj.sub_category_id?.name || '-',
                }

            case services.variant:
                return {
                    ...dataObj,
                    images: dataObj?.images || [],
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                    product: dataObj.product_id?.name || '-',
                    category: dataObj.category_id?.name || '-',
                    sub_category: dataObj.sub_category_id?.name || '-',
                }

            case services.acc_payable:
                return {
                    ...dataObj,
                    invoice_no: dataObj.invoice_id.invoice_no || '',
                    supplier_name: dataObj.supplier_id.name || '',
                }

            case services.acc_receivable:
                return {
                    ...dataObj,
                    invoice_no: dataObj.invoice_id?.invoice_no || '',
                    customer_name: dataObj.customer_id?.name || 'Unknown',
                }

            case services.ledger_daily:
                return {
                    ...dataObj,
                    store_name: dataObj.store_id?.name || '',
                }

            case services.sale_order:
                dataObj.order_items = dataObj.order_items.map((item) => {
                    const newItem = Object.assign({}, item)
                    newItem.item_id = item.item_id?._id || ''
                    newItem.item_name = item.item_id?.name || '-'
                    return newItem
                })
                return dataObj

            case services.sale_order:
            case services.sale_invoice:
            case services.sale_refund:
                return {
                    ...dataObj,
                    employee_name: dataObj.staff_id.name || '',
                    employee_email: dataObj.staff_id.email || '',
                    customer_name: dataObj.customer_id?.name || 'Walk-in',
                    customer_address: dataObj.customer_id?.address || 'Unknown',
                    total_amount: nFormatter(dataObj.total_amount),
                    _created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                    _updated_at: convertDate(dataObj.updated_at, dt_format.full_24, dt_format.full_12),
                }

            case services.purchase_invoice:
                dataObj = {
                    ...dataObj,
                    _created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                    _updated_at: convertDate(dataObj.updated_at, dt_format.full_24, dt_format.full_12),
                }

                dataObj.purchase_items.forEach((item, idx) => {
                    const newItem = Object.assign({}, item)
                    newItem.item_id = item.item_id?._id || ''
                    newItem.item_name = item.item_id?.name || '-'
                    dataObj.purchase_items[idx] = newItem
                })

                return dataObj

            case services.damage_invoice:
                dataObj = {
                    ...dataObj,
                    _created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                    _updated_at: convertDate(dataObj.updated_at, dt_format.full_24, dt_format.full_12),
                }

                dataObj.damage_items.forEach((item, idx) => {
                    const newItem = Object.assign({}, item)
                    newItem.item_id = item.item_id?._id || ''
                    newItem.item_name = item.item_id?.name || '-'
                    dataObj.damage_items[idx] = newItem
                })

                return dataObj

            case services.adjust_invoice:
                dataObj = {
                    ...dataObj,
                    _created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                    _updated_at: convertDate(dataObj.updated_at, dt_format.full_24, dt_format.full_12),
                }

                dataObj.adjust_items.forEach((item, idx) => {
                    const newItem = Object.assign({}, item)
                    newItem.item_id = item.item_id?._id || ''
                    newItem.item_name = item.item_id?.name || '-'
                    dataObj.adjust_items[idx] = newItem
                })

                return dataObj

            case services.expense:
                return {
                    ...dataObj,
                    _created_at: convertDate(dataObj.created_at, dt_format.full_24, dt_format.full_12),
                    _updated_at: convertDate(dataObj.updated_at, dt_format.full_24, dt_format.full_12),
                }

            case services.damage_type:
            case services.coupon_type:
            case services.coupon_code:
                return {
                    ...dataObj,
                    owner_name: dataObj.owner_id?.name || '-',
                    store_name: dataObj.store_id?.name || '-',
                }

            case services.notification:
                return {
                    ...dataObj,
                    store_name: dataObj.store_id?.name || '-',
                }

            case services.weekly_sale:
                return {
                    ...dataObj,
                    issued_at: getWeekDateRange(dataObj._id.year, dataObj._id.week),
                }

            default:
                return dataObj
        }
    }
    return dataObj
}

const varied = (dataArr, service, change) => {
    return dataArr.map((data) => single(data, service, change))
}

const serializer = (data, service, change = false) => {
    switch (true) {
        case !data:
            return null

        case isArray(data):
            return { data: varied(data, service, change) }

        case isArray(data.data):
            // eslint-disable-next-line no-case-declarations
            const newData = varied(data.data, service, change)
            return { ...data, data: newData }

        default:
            return { data: single(data, service, change) }
    }
}

module.exports = serializer

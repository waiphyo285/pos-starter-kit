module.exports.services = {
    user: 'user',
    owner: 'owner',
    owner_type: 'owner_type',
    employee: 'employee',
    employee_type: 'employee_type',
    holiday: 'holiday',
    customer: 'customer',
    customer_type: 'customer_type',
    supplier: 'supplier',
    supplier_type: 'supplier_type',
    store: 'store',
    store_type: 'store_type',
    category: 'category',
    sub_category: 'sub_category',
    product: 'product',
    variant: 'variant',
    expense: 'expense',
    sale_order: 'sale_order',
    sale_invoice: 'sale_invoice',
    sale_refund: 'sale_refund',
    purchase_invoice: 'purchase_invoice',
    damage_invoice: 'damage_invoice',
    adjust_invoice: 'adjust_invoice',
    coupon_type: 'coupon_type',
    coupon_code: 'coupon_code',
    discount_price: 'discount_price',
    daily_sale: 'daily_sale',
    weekly_sale: 'weekly_sale',
    monthly_sale: 'monthly_sale',
    acc_payable: 'acc_payable',
    acc_receivable: 'acc_receivable',
    ledger_daily: 'ledger_daily',
    region: 'region',
    township: 'township',
    notification: 'notification',
    app_config: 'app_config',
    setting: 'setting',
}

module.exports.constant = {
    owner: 'owner',
    manager: 'manager',
    employee: 'employee',
    developer: 'developer',
    amount: 'amount',
    percent: 'percent',
    by_each: 'by-each',
    by_category: 'by-category',
    change_price: 'change-price',
    add_discount_price: 'add-discount-price',
    remove_discount_price: 'remove-discount-price',
}

module.exports.dt_format = {
    // Full date and time formats
    full_24: 'YYYY-MM-DD HH:mm:ss',
    full_12: 'DD/MM/YY hh:mm A',

    // Date only formats
    date_ymd: 'YYYY-MM-DD',
    date_dmy: 'DD/MM/YYYY',
    date_mdy: 'MM/DD/YYYY',

    // Shortened date formats
    short_ymd: 'YY-MM-DD',
    short_dmy: 'DD/MM/YY',
    short_mdy: 'MM/DD/YY',

    // Time only formats
    time_24: 'HH:mm:ss',
    time_12: 'hh:mm:ss A',

    // Custom formats
    cust_12: 'DD MMM YYYY, hh:mm A',
    cust_24: 'DD MMM YYYY, HH:mm:ss',
    cust_day: 'dddd, MMMM Do YYYY',

    // Date and time formats with day of week
    day_full_12: 'dddd, DD/MM/YY hh:mm A',
    day_full_24: 'dddd, YYYY-MM-DD HH:mm:ss',
}

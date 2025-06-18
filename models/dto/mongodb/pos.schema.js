const joi = require('joi')

const dto = (module.exports = {})

dto.subscribePlanDto = joi
    .object()
    .keys({
        plan_type: joi.string().required(),
    })
    .unknown(true)

dto.subscribeOwnerDto = joi
    .object()
    .keys({
        plan_id: joi.string().required(),
    })
    .unknown(true)

dto.ownerTypeDto = joi
    .object()
    .keys({
        name: joi.string().required(),
    })
    .unknown(true)

dto.ownerDto = joi
    .object()
    .keys({
        account_id: joi.string().length(24).allow(null),
        owner_type_id: joi.string().length(24).allow(null),
        city_id: joi.string().length(24).allow(null),
        township_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
        business_name: joi.string().required(),
        business_type: joi.string().valid('convenience', 'restaurant'),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required(),
        phone_1: joi.string().min(9).max(14).regex(/^\d+$/).required(),
    })
    .unknown(true)

dto.employeeTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.holidayDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).required(),
        name: joi.string().required(),
        date: joi.string().required(),
        description: joi.string().allow(''),
        state: joi.string().valid('public', 'company', 'other').required(),
    })
    .unknown(true)

dto.employeeDto = joi
    .object()
    .keys({
        account_id: joi.string().length(24).allow(null),
        staff_type_id: joi.string().length(24).allow(null),
        owner_id: joi.string().length(24).allow(null),
        store_id: joi.string().length(24).allow(null),
        city_id: joi.string().length(24).allow(null),
        township_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required(),
        phone_1: joi.string().min(9).max(14).regex(/^\d+$/).required(),
    })
    .unknown(true)

dto.customerTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.customerDto = joi
    .object()
    .keys({
        account_id: joi.string().length(24).allow(null),
        customer_type_id: joi.string().length(24).allow(null),
        owner_id: joi.string().length(24).allow(null),
        store_id: joi.string().length(24).allow(null),
        city_id: joi.string().length(24).allow(null),
        township_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required(),
        phone_1: joi.string().min(9).max(14).regex(/^\d+$/).required(),
    })
    .unknown(true)

dto.supplierTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.supplierDto = joi
    .object()
    .keys({
        account_id: joi.string().length(24).allow(null),
        owner_id: joi.string().length(24).allow(null),
        store_id: joi.string().length(24).allow(null),
        city_id: joi.string().length(24).allow(null),
        township_id: joi.string().length(24).allow(null),
        supplier_type_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required(),
        phone_1: joi.string().min(9).max(14).regex(/^\d+$/).required(),
    })
    .unknown(true)

dto.storeTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.storeSettingDto = joi
    .object()
    .keys({
        name: joi.string().required(),
        owner_id: joi.string().length(24).allow(null),
        store_id: joi.string().length(24).allow(null),
        printing: joi.object().keys({
            header_logo: joi.string().allow(''),
            header_addr: joi.string().allow(''),
            header_phone_1: joi.string().allow(''),
            header_phone_2: joi.string().allow(''),
            footer_desc_1: joi.string().allow(''),
            footer_desc_2: joi.string().allow(''),
        }),
    })
    .unknown(true)

dto.storeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).allow(null),
        store_type_id: joi.string().length(24).allow(null),
        city_id: joi.string().length(24).allow(null),
        township_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required(),
        phone_1: joi.string().min(9).max(14).regex(/^\d+$/).required(),
    })
    .unknown(true)

dto.expenseDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        total_amount: joi.number().min(0).required(),
    })
    .unknown(true)

dto.createCartDto = joi
    .object()
    .keys({
        item_id: joi.string().length(24).required(),
    })
    .unknown(true)

dto.holdOrderDto = joi
    .object()
    .keys({
        sale_order_id: joi.string().length(24).required(),
    })
    .unknown(true)

dto.updateCartDto = joi
    .object({
        order_items: joi
            .array()
            .items(
                joi.object({
                    item_id: joi.string().hex().length(24).required(),
                    quantity: joi.string().regex(/^\d+$/).required(),
                })
            )
            .required(),
    })

    .unknown(true)

dto.proceedOrderDto = joi
    .object({
        paymethod_id: joi.string().hex().length(24).required(),
        remark: joi.string().allow('').required(),
        promo_code: joi.string().allow('').required(),
        printed: joi.string().valid('0', '1').required(),
    })
    .unknown(true)

dto.saleOrderDto = joi
    .object({
        store_id: joi.string().hex().length(24).required(),
        staff_id: joi.string().hex().length(24).required(),
        state: joi.string().valid('draft', 'opened', 'paid').required(),
        order_items: joi
            .array()
            .items(
                joi.object({
                    item_id: joi.string().hex().length(24).required(),
                    quantity: joi.number().integer().min(1).required(),
                    retail_price: joi.number().min(0).required(),
                })
            )
            .required(),
    })
    .unknown(true)

dto.purchaseInvoiceDto = joi
    .object({
        purchased_at: joi
            .string()
            .regex(/^\d{2}\/\d{2}\/\d{4}$/)
            .required(),
        store_id: joi.string().hex().length(24).required(),
        supplier_id: joi.string().hex().length(24).required(),
        state: joi.string().valid('draft', 'opened', 'paid').required(),
        purchase_items: joi
            .array()
            .items(
                joi.object({
                    item_id: joi.string().hex().length(24).required(),
                    quantity: joi.number().integer().min(1).required(),
                    retail_price: joi.number().min(0).required(),
                })
            )
            .required(),
    })
    .unknown(true)

dto.damageInvoiceDto = joi
    .object({
        damaged_at: joi
            .string()
            .regex(/^\d{2}\/\d{2}\/\d{4}$/)
            .required(),
        store_id: joi.string().hex().length(24).required(),
        // staff_id: joi.string().hex().length(24).required(),
        state: joi.string().valid('draft', 'opened', 'paid').required(),
        damage_items: joi
            .array()
            .items(
                joi.object({
                    item_id: joi.string().hex().length(24).required(),
                    quantity: joi.number().integer().min(1).required(),
                    retail_price: joi.number().min(0).required(),
                })
            )
            .required(),
    })
    .unknown(true)

dto.adjustInvoiceDto = joi
    .object({
        adjusted_at: joi
            .string()
            .regex(/^\d{2}\/\d{2}\/\d{4}$/)
            .required(),
        store_id: joi.string().hex().length(24).required(),
        // staff_id: joi.string().hex().length(24).required(),
        state: joi.string().valid('draft', 'opened', 'paid').required(),
        adjust_items: joi
            .array()
            .items(
                joi
                    .object({
                        type: joi.string().valid('Add', 'Less').required(),
                        item_id: joi.string().hex().length(24).required(),
                        quantity: joi.number().integer().min(1).required(),
                        retail_price: joi.number().min(0).required(),
                    })
                    .unknown(true)
            )
            .required(),
    })
    .unknown(true)

dto.categoryDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.subCategoryDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        category_id: joi.string().length(24).allow(null),
        name: joi.string().required(),
    })
    .unknown(true)

dto.productDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).allow(null),

        category_id: joi.string().length(24).allow(null),
        sub_category_id: joi.string().length(24).allow(null),

        name: joi.string().required(),
        type: joi.string().valid('standard', 'service'),

        barcode: joi.string().allow(''),
        barcode_sym: joi.string().valid('code128', 'code39'),

        cost: joi.number().min(0).required(),
        retail_price: joi.number().min(0).required(),
        wholesale_price: joi.number().min(0).required(),

        tax_percent: joi.number().min(0).required(),
        tax_method: joi.string().valid('inclusive', 'exclusive'),

        is_variant: joi.string().valid('1', '0').allow(''),
    })
    .unknown(true)

dto.variantDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).allow(null),

        category_id: joi.string().length(24).allow(null),
        sub_category_id: joi.string().length(24).allow(null),
        product_id: joi.string().length(24).required(),

        name: joi.string().required(),
        barcode: joi.string().allow(''),
        barcode_sym: joi.string().valid('code128', 'code39'),

        stock: joi.number().min(0).required(),

        cost: joi.number().min(0).required(),
        retail_price: joi.number().min(0).required(),
        wholesale_price: joi.number().min(0).required(),

        tax_percent: joi.number().min(0).required(),
        tax_method: joi.string().valid('inclusive', 'exclusive'),
    })
    .unknown(true)

dto.damageTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).required(),
        name: joi.string().required(),
    })
    .unknown(true)

dto.couponTypeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).required(),
        name: joi.string().required(),
        type: joi.string().required(),
    })
    .unknown(true)

dto.couponCodeDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).required(),
        current_times: joi.number().default(0),
        max_times: joi.number().default(0),
    })
    .unknown(true)

dto.notificationDto = joi
    .object()
    .keys({
        title: joi.string().required(),
        message: joi.string().required(),
    })
    .unknown(true)

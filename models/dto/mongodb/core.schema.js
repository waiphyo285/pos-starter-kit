const joi = require('joi')

const dto = (module.exports = {})

const menuDto = joi
    .object()
    .keys({
        menuid: joi.string(),
        access: joi.string(),
        submenu: joi.array().items(
            joi
                .object()
                .keys({
                    menuid: joi.string(),
                    access: joi.string(),
                    read: joi.string(),
                    edit: joi.string(),
                    delete: joi.string(),
                })
                .default([])
        ),
    })
    .unknown(true)

dto.userRoleDto = joi
    .object()
    .keys({
        role: joi.string().required(),
        level: joi.string().required(),
        program: joi.array().items(menuDto).default([]),
    })
    .unknown(true)

dto.userDto = joi
    .object()
    .keys({
        username: joi
            .string()
            .regex(/^[a-z0-9]*$/)
            .min(8)
            .max(16)
            .required(),
        password: joi
            .string()
            .regex(/^[a-z0-9]*$/)
            .min(8)
            .max(16)
            .required(),
        user_type: joi.string().allow(null),
    })
    .unknown(true)

dto.configAppDto = joi
    .object()
    .keys({
        owner_id: joi.string().length(24).required(),
        store_id: joi.string().length(24).required(),
    })
    .unknown(true)

dto.bankDto = joi
    .object()
    .keys({
        name: joi.string().required(),
    })
    .unknown(true)

dto.currencyDto = joi
    .object()
    .keys({
        name: joi.string().required(),
        sign: joi.string().required(),
    })
    .unknown(true)

dto.cityDto = joi
    .object()
    .keys({
        city_mm: joi.string().required(),
    })
    .unknown(true)

dto.townshipDto = joi
    .object()
    .keys({
        cityid: joi.string().length(24).required(),
        township_mm: joi.string().required(),
    })
    .unknown(true)

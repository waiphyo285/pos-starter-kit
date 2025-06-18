const joi = require('joi')
const clr = require('@config/logcolor')
const { createResponse } = require('@utils/handlers/response')

const isValidData = (schema, property) => {
    return (req, res, next) => {
        const { error } = joi.validate(req.body, schema)
        const locales = res.locals.i18n.translations

        req.body && iamlog.info('Validate body ', req.body)
        error && iamlog.error('Validate error', error)

        const prev = () => {
            const { details } = error
            const message = details.map((i) => i.message).join(',')
            res.status(422).json(createResponse(422, { data: { message } }, locales))
        }
        error === null ? next() : prev()
    }
}

module.exports = isValidData

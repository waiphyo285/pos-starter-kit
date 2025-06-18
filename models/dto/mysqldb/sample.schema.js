const joi = require('joi')

const dto = (module.exports = {})

dto.teacherDto = joi
    .object()
    .keys({
        name: joi
            .string()
            .required()
            .error(() => 'name must be a string'),
        age: joi.number().error(() => 'age must be a number'),
        degree: joi.string().error(() => 'grade must be a number'),
    })
    .unknown(true)

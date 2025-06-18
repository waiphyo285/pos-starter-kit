const joi = require('joi')

const dto = (module.exports = {})

dto.studentDto = joi
    .object()
    .keys({
        name: joi
            .string()
            .required()
            .error(() => 'name must be a string'),
        age: joi.number().error(() => 'age must be a number'),
        grade: joi.number().error(() => 'grade must be a number'),
    })
    .unknown(true)

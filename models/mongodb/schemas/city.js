const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    city_mm: {
        type: String,
        required: true,
    },
    city_en: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    unit: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: Boolean,
    },
    created_at: { type: Date },
    updated_at: { type: Date },
})

makeSchema.plugin(SchemaPlugin)
makeSchema.plugin(MongooseDelete, { overrideMethods: ['count', 'find'] })

module.exports = mongoose.model('city', makeSchema)

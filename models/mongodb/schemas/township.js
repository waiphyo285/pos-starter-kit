const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    cityid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city',
    },
    township_mm: {
        type: String,
        required: true,
    },
    township_en: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: Boolean,
        default: true,
    },
    created_at: { type: Date },
    updated_at: { type: Date },
})

makeSchema.plugin(SchemaPlugin)
makeSchema.plugin(MongooseDelete, { overrideMethods: ['count', 'find'] })

module.exports = mongoose.model('township', makeSchema)

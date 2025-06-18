const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema
const makeSchema = new Schema({
    type: {
        type: String,
        enum: ['teacher', 'student'],
        default: 'teacher',
    },
    count: {
        type: Number,
        default: 1,
    },
    prefix: {
        type: String,
        required: true,
    },
    created_at: { type: Date },
    updated_at: { type: Date },
})

makeSchema.plugin(SchemaPlugin)
makeSchema.plugin(MongooseDelete, { overrideMethods: ['count', 'find'] })

module.exports = mongoose.model('auto_code', makeSchema)

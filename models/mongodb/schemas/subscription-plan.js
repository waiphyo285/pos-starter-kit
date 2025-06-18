const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    plan_type: {
        type: String,
        required: true,
    },
    max_store: {
        type: Number,
        default: 0,
    },
    max_user: {
        type: Number,
        default: 0,
    },
    max_item: {
        type: Number,
        default: 0,
    },
    max_device: {
        type: Number,
        default: 0,
    },
    all_module: {
        type: Boolean,
        default: true,
    },
    duration: {
        type: Number,
        default: 1,
    },
    status: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
})

makeSchema.plugin(SchemaPlugin)
makeSchema.plugin(MongooseDelete, { overrideMethods: ['count', 'find'] })

module.exports = mongoose.model('subscription_plan', makeSchema)

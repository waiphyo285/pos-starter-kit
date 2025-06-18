const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription_plan',
        default: null,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        default: null,
    },
    started_at: {
        type: Date,
    },
    expired_at: {
        type: Date,
    },
    description: {
        type: String,
        default: '',
    },
    is_renew: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
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

module.exports = mongoose.model('subscription_owner', makeSchema)

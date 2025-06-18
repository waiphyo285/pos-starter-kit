const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        default: null,
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        default: null,
    },
    coupon_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupon_type',
        default: null,
    },
    code: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    promo_amount: {
        type: Number,
        default: 0,
    },
    max_times: {
        type: Number,
        default: 0,
    },
    current_times: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: false,
    },
    expired_at: {
        type: Date,
        default: null,
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

module.exports = mongoose.model('coupon_code', makeSchema)

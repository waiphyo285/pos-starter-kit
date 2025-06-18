const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        default: null,
    },
    customer_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer_type',
        default: null,
    },
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
    city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city',
        default: null,
    },
    township_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'township',
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple documents to have a null value for this field,
        validate: {
            validator: function (v) {
                // Allow null or unique non-empty strings
                return v === null || (typeof v === 'string' && v.trim().length > 0)
            },
            message: 'Email must be unique or null',
        },
    },
    phone_1: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                // Allow null or unique non-empty strings
                return v === null || (typeof v === 'string' && v.trim().length > 0)
            },
            message: 'Phone 1 must be unique or null',
        },
    },
    phone_2: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    reward_point: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
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

module.exports = mongoose.model('customer', makeSchema)

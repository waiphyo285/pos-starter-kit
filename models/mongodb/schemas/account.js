const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        default: null,
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        default: null,
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        default: null,
    },
    account_type: {
        type: String,
        enum: ['developer', 'owner', 'employee', 'customer', 'supplier'],
        default: 'developer',
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

module.exports = mongoose.model('account', makeSchema)

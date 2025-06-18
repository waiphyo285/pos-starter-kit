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
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        required: true,
    },
    invoice_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'purchase_invoice',
        required: true,
    },
    due_amount: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending',
    },
    due_date: {
        type: Date,
        required: true,
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

module.exports = mongoose.model('acc_payable', makeSchema)

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
    transactions: [
        {
            invoice_id: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'transactions.invoice_type',
            },
            invoice_type: {
                type: String,
                enum: ['sale_invoice', 'purchase_invoice', 'damage_invoice', 'adjust_invoice'],
            },
            description: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                enum: ['credit', 'debit'],
                required: true,
            },
        },
    ],
    total_credit: {
        type: Number,
        required: true,
    },
    total_debit: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    date: {
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

module.exports = mongoose.model('ledger_daily', makeSchema)

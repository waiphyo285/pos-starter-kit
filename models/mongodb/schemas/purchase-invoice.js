const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const makeSchema = new mongoose.Schema({
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
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
        default: null,
    },
    invoice_no: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_items: [
        {
            item_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'variant',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            retail_price: {
                type: Number,
                required: true,
            },
            wholesale_price: {
                type: Number,
                default: 0,
            },
            subtotal_amount: {
                type: Number,
                required: true,
            },
        },
    ],
    subtotal_amount: {
        type: Number,
        required: true,
    },
    discount_amount: {
        type: Number,
        default: 0,
    },
    tax_amount: {
        type: Number,
        default: 0,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    remark: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        enum: ['draft', 'opened', 'paid'],
        default: 'draft',
    },
    purchased_at: {
        type: Date,
        default: new Date(),
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

module.exports = mongoose.model('purchase_invoice', makeSchema)

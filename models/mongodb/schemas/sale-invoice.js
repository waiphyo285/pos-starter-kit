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
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        default: null,
    },
    paymethod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bank',
        default: null,
    },
    invoice_no: {
        type: String,
        unique: true,
        required: true,
    },
    order_no: {
        type: String,
        required: true,
    },
    order_items: [
        {
            item_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'variant',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            barcode: {
                type: String,
                required: true,
            },
            barcode_sym: {
                type: String,
                enum: ['code128', 'code39'],
                default: 'code128',
            },
            cost: {
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
            quantity: {
                type: Number,
                required: true,
            },
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
    printed: {
        type: Boolean,
        default: false,
    },
    state: {
        type: String,
        enum: ['draft', 'opened', 'paid', 'refund'],
        default: 'draft',
    },
    ordered_at: {
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

module.exports = mongoose.model('sale_invoice', makeSchema)

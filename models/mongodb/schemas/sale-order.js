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
    order_no: {
        type: String,
        unique: true,
        required: true,
    },
    order_items: [
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
    state: {
        type: String,
        enum: ['pending', 'accepted', 'ready', 'pickup', 'completed'],
        default: 'pending',
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

makeSchema.index(
    { created_at: 1 },
    {
        expireAfterSeconds: 86400, // after 1 day
        partialFilterExpression: { state: 'pending' },
    }
)

module.exports = mongoose.model('sale_order', makeSchema)

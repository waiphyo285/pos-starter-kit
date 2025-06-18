const { mongoose } = require('../connection')
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
    total_quantity: {
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
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
})

makeSchema.plugin(SchemaPlugin)

module.exports = mongoose.model('top_selling', makeSchema)

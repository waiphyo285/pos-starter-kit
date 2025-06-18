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
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        default: null,
    },
    sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sub_category',
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    barcode: {
        type: String,
        unique: true,
        required: true,
    },
    barcode_sym: {
        type: String,
        enum: ['code128', 'code39'],
        default: 'code128',
    },
    cost: {
        type: Number,
        default: 0,
    },
    retail_price: {
        type: Number,
        required: true,
    },
    wholesale_price: {
        type: Number,
        default: 0,
    },
    attribute_price: [
        {
            min_quantity: {
                type: Number,
                default: 0,
            },
            price: {
                type: Number,
                default: 0,
            },
        },
    ],
    attribute_variant: [
        {
            key: {
                type: String,
                default: '',
            },
        },
    ],
    tax_method: {
        type: String,
        enum: ['inclusive', 'exclusive'],
        default: 'inclusive',
    },
    tax_percent: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
        default: [],
    },
    description: {
        type: String,
        default: '',
    },
    is_variant: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model('product', makeSchema)

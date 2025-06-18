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
    name: {
        type: String,
        required: true,
    },
    rounding: {
        type: String,
        enum: ['disabled', 'up', 'down', 'nearest'],
        default: 'disabled',
    },
    currency: {
        type: String,
        default: 'MMK',
    },
    timezone: {
        type: String,
        default: 'Asia/Yangon',
    },
    printing: {
        header_logo: {
            type: String,
            default: '',
        },
        header_addr: {
            type: String,
            default: '',
        },
        header_phone_1: {
            type: String,
            default: '',
        },
        header_phone_2: {
            type: String,
            default: '',
        },
        footer_desc_1: {
            type: String,
            default: '',
        },
        footer_desc_2: {
            type: String,
            default: '',
        },
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

module.exports = mongoose.model('store_setting', makeSchema)

const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    store_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store_type',
        default: null,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
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
        required: true,
        unique: true,
    },
    phone_1: {
        type: String,
        required: true,
        unique: true,
    },
    phone_2: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
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

module.exports = mongoose.model('store', makeSchema)

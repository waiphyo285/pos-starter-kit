const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        default: null,
    },
    owner_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner_type',
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
    business_name: {
        type: String,
        required: true,
    },
    business_type: {
        type: String,
        enum: ['convenience', 'restaurant'],
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
    // max_store: {
    //     type: Number,
    //     default: 0,
    // },
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

module.exports = mongoose.model('owner', makeSchema)

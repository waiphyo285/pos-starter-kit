const { mongoose } = require('../connection')
const MongooseDelete = require('mongoose-delete')
const SchemaPlugin = require('./helpers/schema-plugin')

const Schema = mongoose.Schema

const makeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
    ref_link: {
        type: String,
        default: '',
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        default: null,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        default: null,
    },
    image: {
        type: String,
        default: '',
    },
    priority: {
        type: Number,
        default: 1,
    },
    status: {
        type: Boolean,
        default: true,
    },
    created_at: { type: Date },
    updated_at: { type: Date },
})

makeSchema.plugin(SchemaPlugin)
makeSchema.plugin(MongooseDelete, { overrideMethods: ['count', 'find'] })

module.exports = mongoose.model('notification', makeSchema)

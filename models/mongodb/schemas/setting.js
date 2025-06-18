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
    theme: {
        type: String,
        enum: ['default', 'action', 'comedy', 'crime', 'history', 'reality', 'news', 'sport'],
        default: 'default',
    },
    locale: {
        type: String,
        enum: ['en_US', 'my_MM'],
        default: 'en_US',
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

module.exports = mongoose.model('setting', makeSchema)

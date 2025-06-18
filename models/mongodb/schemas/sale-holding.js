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
    sale_order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sale_order',
        default: null,
    },
    state: {
        type: String,
        enum: ['pending'],
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

module.exports = mongoose.model('sale_holding', makeSchema)

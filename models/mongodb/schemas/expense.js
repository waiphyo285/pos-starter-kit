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
    invoice_no: {
        type: String,
        unique: true,
        required: true,
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
        enum: ['draft', 'opened', 'paid'],
        default: 'draft',
    },
    expensed_at: {
        type: Date,
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

module.exports = mongoose.model('expense', makeSchema)

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
    role: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    program: [
        {
            menuid: {
                type: String,
                required: true,
            },
            access: {
                type: Boolean,
                default: false,
            },
            submenu: [
                {
                    menuid: {
                        type: String,
                        required: true,
                    },
                    access: {
                        type: Boolean,
                        default: false,
                    },
                    read: {
                        type: Boolean,
                        default: false,
                    },
                    edit: {
                        type: Boolean,
                        default: false,
                    },
                    delete: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
        },
    ],
    who_access: {
        type: String,
        enum: ['developer', 'owner', 'employee', 'customer', 'supplier'],
        default: 'developer',
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

module.exports = mongoose.model('user_role', makeSchema)

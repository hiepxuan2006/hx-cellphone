const mongoose = require('mongoose');
const { Schema } = mongoose;

const Tag = new Schema(
    {
        title: {
            type: String,
            require: true,
            trim: true,
            index: true,
            unique: true,
        },
        slug: {
            type: String,
            trim: true,
            required: true,
            index: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
            index: true,
        },

        is_active: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true },
);

module.exports = Tag;

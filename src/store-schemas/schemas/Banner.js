const { Schema } = require('mongoose');

const Banner = new Schema(
    {
        link: {
            type: String,
            trim: true,
        },

        image: {
            type: String,
            require: true,
        },
        horizontal: {
            type: Boolean,
            default: false,
            index: true,
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
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

module.exports = Banner;

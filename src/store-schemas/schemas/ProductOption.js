const { Schema } = require('mongoose');

const ProductOption = new Schema({
    _id: false,

    is_preselected: {
        type: Boolean,
        default: false,
    },

    name: {
        type: String,
        trim: true,
    },

    slug: {
        type: String,
        trim: true,
    },

    value: {
        type: String,
        trim: true,
    },

    position: {
        type: Number,
        default: 0,
    },

    quantity: {
        type: Number,
    },

    attribute: {
        type: Schema.Types.ObjectId,
        ref: 'ProductAttribute',
        required: true,
    },
});

module.exports = ProductOption;

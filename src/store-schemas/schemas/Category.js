const { Schema } = require('mongoose');

const Category = new Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        // unique: true,
    },
    label: {
        type: String,
        trim: true,
        require: true,
    },
    icon: {
        type: String,
        trim: true,
    },
    banner: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },

    key: {
        type: String,
        trim: true,
    },

    parent_id: {
        type: String,
        index: true,
        default: '0',
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

    slug: {
        type: String,
    },
});

module.exports = Category;

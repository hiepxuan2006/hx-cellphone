const { Schema } = require('mongoose');

const Order = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        index: true,
    },

    discount: {
        type: Number,
        default: 0,
    },

    status: {
        type: String,
        trim: true,
        index: true,
        default: 'processing',
        num: ['processing , confirmed , cancelled , shipping , delivered'],
    },

    order_item: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderItem',
            index: true,
            require: true,
        },
    ],

    confirmed_at: {
        type: Date,
        index: true,
    },

    cancelled_at: {
        type: Date,
    },

    order_at: {
        type: Date,
    },

    delivery_type: {
        type: String,
        require: true,
    },

    payment_type: {
        type: String,
        require: true,
    },

    paid: {
        type: Boolean,
        default: false,
    },

    shipping_at: {
        type: Date,
    },

    delivered_at: {
        type: Date,
    },

    shipping_address: {
        type: String,
        require: true,
    },

    order_code: {
        type: String,
        index: true,
        require: true,
    },

    name: {
        type: String,
        require: true,
        index: true,
    },
    email: {
        type: String,
        index: true,
    },

    phone_number: {
        type: String,
        require: true,
        index: true,
    },
    note: {
        type: String,
        trim: true,
    },
    price_total: {
        type: Number,
        require: true,
        trim: true,
    },
});

module.exports = Order;

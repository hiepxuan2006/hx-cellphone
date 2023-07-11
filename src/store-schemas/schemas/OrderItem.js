const { Schema } = require('mongoose');

const OrderItem = new Schema(
    {
        order_id: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        },

        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            index: true,
        },

        product_variant_id: {
            type: Schema.Types.ObjectId,
            ref: 'ProductVariant',
            index: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            index: true,
            require: true,
        },
        image_uris: [{ type: String, trim: true }],
        quantity: {
            type: Number,
            require: true,
        },
    },
    { timestamps: true },
);

module.exports = OrderItem;

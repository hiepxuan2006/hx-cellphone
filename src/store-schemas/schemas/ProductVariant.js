const mongoose = require("mongoose")
const { Schema } = mongoose

const ProductVariant = new Schema({
  title: {
    type: String,
    trim: true,
  },

  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
    index: true,
  },

  image_uris: [{ type: String, trim: true }],

  is_sale: {
    type: Boolean,
    default: false,
    index: true,
  },

  sale: {
    type: Number,
    default: 0,
  },

  options: [{}],

  retail_price: {
    type: Number,
    default: 0,
  },

  sale_price: {
    type: Number,
    index: true,
  },

  sku: {
    type: String,
    trim: true,
    index: true,
  },

  is_default: {
    type: Boolean,
    required: true,
    default: false,
    index: true,
  },

  is_active: {
    type: Boolean,
    default: true,
  },
})

module.exports = ProductVariant

const mongoose = require("mongoose")
const { Schema } = mongoose

const Product = new Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    index: true,
    unique: true,
  },

  created_by: {
    type: Schema.Types.ObjectId,
    index: true,
  },

  slug: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },

  description: {
    type: String,
    trim: true,
    required: true,
  },

  salient_features: {
    type: String,
    trim: true,
    required: true,
  },

  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  sub_category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],

  tags: [
    {
      type: String,
      trim: true,
      index: true,
    },
  ],

  variants: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
  ],

  attributes: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductAttribute",
    },
  ],

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

  retail_price: {
    type: Number,
    index: true,
    require: true,
  },

  sale: {
    type: Number,
    default: 0,
    index: true,
  },

  is_sale: {
    type: Boolean,
    default: false,
    index: true,
  },
  images: [
    {
      type: String,
    },
  ],

  seo_information: {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    allow_redirect: {
      type: [String],
      default: [],
      trim: true,
      index: true,
    },
    is_redirect: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
})

module.exports = Product

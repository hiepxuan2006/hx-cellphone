const mongoose = require("mongoose")
const { Schema } = mongoose

const ProductAttribute = new Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },

  slug: {
    type: String,
    trim: true,
    require: true,
  },
  type: {
    type: String,
    trim: true,
    require: true,
  },

  position: {
    type: Number,
    require: true,
  },

  values: [
    {
      type: Schema.Types.Mixed,
      default: {},
    },
  ],
})

module.exports = ProductAttribute

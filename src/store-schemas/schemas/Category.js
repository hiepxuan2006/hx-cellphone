const { Schema } = require("mongoose")

const Category = new Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  label: {
    type: String,
    trim: true,
    require: true,
  },
  key: {
    type: String,
    trim: true,
  },

  parent_id: {
    type: String,
    index: true,
    default: "0",
  },

  slug: {
    type: String,
  },
})

module.exports = Category

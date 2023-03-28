const { Schema } = require("mongoose")

const Slider = new Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
    },

    description: {
      type: String,
      trim: true,
      require: true,
    },

    link: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      require: true,
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

    created: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    updated: {
      type: Date,
    },
  },
  { timestamps: true }
)

module.exports = Slider

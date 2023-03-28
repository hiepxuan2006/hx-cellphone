const { Schema } = require("mongoose")

const Post = new Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
    },

    slug: {
      type: String,
      trim: true,
      require: true,
    },

    label: {
      type: String,
      trim: true,
      require: true,
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

module.exports = Post

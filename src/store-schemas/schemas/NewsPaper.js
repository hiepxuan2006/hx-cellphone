const { Schema } = require("mongoose")

const NewsPaper = new Schema(
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

    content: {
      type: String,
      trim: true,
      require: true,
    },

    topic_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      require: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        require: true,
      },
    ],

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

    author: {
      type: Schema.Types.ObjectId,
      ref: "Account",
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

module.exports = NewsPaper

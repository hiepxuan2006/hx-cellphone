const { Schema } = require("mongoose")

module.exports = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
    },
    id_google: {
      type: String,
      default: null,
    },
    auth_type: [
      {
        type: String,
        enum: ["local", "google"],
      },
    ],
    roles: {
      type: [String],
      default: ["customer"],
    },

    is_admin: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      default: "inactive",
      index: true,
    },

    address: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      trim: true,
    },

    phone_number: {
      type: String,
      trim: true,
    },

    connected: {
      type: Schema.Types.Mixed,
      default: {},
    },

    last_time_logout: {
      type: Date,
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

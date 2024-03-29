const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const user = model("user", userSchema);
module.exports = user;

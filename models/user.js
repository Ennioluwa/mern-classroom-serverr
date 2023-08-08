const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: "Email already exists",
      match: [/.+\@.+\..+/, "Please fill in a valid email address"],
    },
    password: {
      type: String,
      required: "Password is required",
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    educator: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    default: "",
  },

  phoneNumber: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  avatar: {
    type: String,
    default: "",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  }
},
{
  timestamps: true,
}
);

module.exports =
mongoose.model("User", userSchema);
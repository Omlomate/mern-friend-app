const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hobby: { type: String, required: false }, // Optional hobby field
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

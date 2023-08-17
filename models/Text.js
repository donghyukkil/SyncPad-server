const mongoose = require("mongoose");

const { Schema } = mongoose;

const textSchema = new Schema({
  userEmail: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Text", textSchema);

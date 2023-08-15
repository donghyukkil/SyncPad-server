const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  texts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Text",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

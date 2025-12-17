const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String,required: true, unique: true },
    password: { type: String, required: true },

  resetToken: String,
  resetTokenExpire: Date
});

module.exports = mongoose.model("Admin", adminSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    employeeId: {
      type: String,
      unique: true
    },
    profileImage: {
        type: String
    },

    name: { type: String, required: true },
    professionalEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personalEmail: String,
    dob: Date,
    dateOfJoining: Date,
    role: String,
    manager: String,
    projects: [String],
    employmentType: String,
    address: String,
    phone: String,
    profileImage: String // image URL later
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

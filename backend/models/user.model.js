const mongoose = require('mongoose')

//Schema
const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
  },
  { timestamps: true }
)

const User = mongoose.model('user', UserSchema)

module.exports = User

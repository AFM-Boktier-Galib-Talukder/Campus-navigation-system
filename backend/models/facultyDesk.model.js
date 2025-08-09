const mongoose = require('mongoose')

const facultySchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    initial: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Faculty', facultySchema)

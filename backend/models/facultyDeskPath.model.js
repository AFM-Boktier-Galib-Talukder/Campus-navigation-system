const mongoose = require('mongoose')

const FacultyDeskSchema = new mongoose.Schema({
  dot: { type: Number, required: true, unique: true },
  connection: { type: [Number], required: true },
  left: { type: String, default: '' },
  right: { type: String, default: '' },
})

const FacultyDeskDesign = mongoose.model('facultyDesk', FacultyDeskSchema)

module.exports = FacultyDeskDesign

const mongoose = require('mongoose')

//Schema
const FloorSchema = new mongoose.Schema({
  dot: { type: Number, required: true, unique: true },
  connection: { type: [Number], required: true },
  left: { type: String, default: '' },
  right: { type: String, default: '' },
  up: { type: Number, default: null },
  down: { type: Number, default: null },
})

const FloorDesign = mongoose.model('floor', FloorSchema)

module.exports = FloorDesign


const mongoose = require('mongoose')

// Schema mirrors floorDesign for library-specific graph
const LibrarySchema = new mongoose.Schema({
  dot: { type: Number, required: true, unique: true },
  connection: { type: [Number], required: true },
  left: { type: String, default: '' },
  right: { type: String, default: '' },
  up: { type: Number, default: null },
  down: { type: Number, default: null },
})

// Explicitly bind to the 'library' collection in testCRUD (avoid Mongoose pluralization to 'libraries')
const LibraryDesign = mongoose.model('library', LibrarySchema, 'library')

module.exports = LibraryDesign



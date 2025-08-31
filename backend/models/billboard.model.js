const mongoose = require('mongoose')

const BillboardSchema = new mongoose.Schema(
  {
    imageBase64: { type: String, required: true },
    title: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true }, // e.g., YYYY-MM-DD
    time: { type: String, required: true }, // e.g., HH:mm
    description: { type: String, required: true },
    hostedBy: { type: String, required: true }, // Organization or person hosting the event
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true }
)

const Billboard = mongoose.model('billboard', BillboardSchema, 'billboards')

module.exports = Billboard

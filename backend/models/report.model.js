const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    userName: { type: String },
    userEmail: { type: String },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

const Report = mongoose.model('report', ReportSchema, 'reports')

module.exports = Report

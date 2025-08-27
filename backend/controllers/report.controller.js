const Report = require('../models/report.model')

async function createReport(req, res) {
  try {
    const { userId, userName, userEmail, type, title, description } = req.body
    if (!type || !title || !description) {
      return res.status(400).json({ error: 'type, title and description are required' })
    }
    const report = await Report.create({ userId, userName, userEmail, type, title, description })
    res.status(201).json({ id: report._id, message: 'Report created' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create report' })
  }
}

module.exports = { createReport }
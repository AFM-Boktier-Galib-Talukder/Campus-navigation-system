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

async function listReports(req, res) {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 }).lean()
    res.json(reports)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
}

async function deleteReport(req, res) {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'report id is required' })
    }
    const deleted = await Report.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report' })
  }
}

module.exports = { createReport, listReports, deleteReport }
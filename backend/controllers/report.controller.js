const Report = require('../models/report.model')

async function createReport(req, res) {
  try {
    const { userId, userName, userEmail, type, title, description } = req.body
    if (!type || !title || !description) {
      return res
        .status(400)
        .json({ error: 'type, title and description are required' })
    }

    // Handle event image if present
    let eventImage = null
    if (req.file && type === 'events') {
      eventImage = req.file.filename // Store just the filename
    }

    const reportData = {
      userId,
      userName,
      userEmail,
      type,
      title,
      description,
    }

    // Add eventImage only if it exists
    if (eventImage) {
      reportData.eventImage = eventImage
    }

    const report = await Report.create(reportData)
    res.status(201).json({ id: report._id, message: 'Report created' })
  } catch (err) {
    console.error('Error creating report:', err)
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

const Billboard = require('../models/billboard.model')

async function createBillboard(req, res) {
  try {
    const { imageBase64, title, venue, date, time, description, createdBy } = req.body
    if (!imageBase64 || !title || !venue || !date || !time || !description) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const doc = await Billboard.create({ imageBase64, title, venue, date, time, description, createdBy })
    res.status(201).json({ id: doc._id, message: 'Billboard created' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create billboard' })
  }
}

async function listBillboards(req, res) {
  try {
    const items = await Billboard.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch billboards' })
  }
}

module.exports = { createBillboard, listBillboards }
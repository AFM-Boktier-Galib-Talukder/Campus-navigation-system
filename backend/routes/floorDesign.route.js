const express = require('express')
const floorRouter = express.Router()
const {
  getAllNodes,
  getShortestPath,
} = require('../controllers/path.controller')
const FloorDesign = require('../models/floorDesign.model')
//Routes

floorRouter.get('/nodes', getAllNodes)
floorRouter.get('/path', getShortestPath)

// Autocomplete endpoint: search by room substring across left and right
floorRouter.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || !q.trim()) return res.json({ results: [] })
    const query = q.trim()
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const docs = await FloorDesign.find({
      $or: [{ left: { $regex: regex } }, { right: { $regex: regex } }],
    })
      .limit(10)
      .lean()

    // Build unique room list preserving order
    const seen = new Set()
    const results = []
    for (const d of docs) {
      if (d.left && regex.test(d.left) && !seen.has(d.left.toLowerCase())) {
        seen.add(d.left.toLowerCase())
        results.push({ label: d.left, dot: d.dot })
      }
      if (d.right && regex.test(d.right) && !seen.has(d.right.toLowerCase())) {
        seen.add(d.right.toLowerCase())
        results.push({ label: d.right, dot: d.dot })
      }
    }
    if (results.length === 0) return res.json({ results: [] })
    res.json({ results })
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
})

module.exports = floorRouter

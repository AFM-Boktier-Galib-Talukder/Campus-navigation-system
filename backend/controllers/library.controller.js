const LibraryDesign = require('../models/library.model')
const {
  buildGraph,
  findShortestPath,
  generateDirections,
  generateDistance,
} = require('../utils/pathfinder.utils')
const { floor_jump } = require('../utils/floor_jump.utils')
const { findLibraryDotsForRooms } = require('../utils/library_dot_finder.utils')

async function getAllLibraryNodes(req, res) {
  try {
    const nodes = await LibraryDesign.find({})
    res.json(nodes)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch library nodes' })
  }
}

async function librarySearch(req, res) {
  try {
    const { q } = req.query
    if (!q || !q.trim()) return res.json({ results: [] })
    const query = q.trim()
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const docs = await LibraryDesign.find({
      $or: [{ left: { $regex: regex } }, { right: { $regex: regex } }],
    })
      .limit(10)
      .lean()

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
    res.json({ results })
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
}

async function getLibraryShortestPath(req, res) {
  try {
    const { start, end, choice } = req.query
    if (!start || !end || !choice) {
      return res.status(400).json({ error: 'Missing start, end, or choice parameters' })
    }

    const isNumericStart = /^\d+$/.test(String(start))
    const isNumericEnd = /^\d+$/.test(String(end))

    let startDot = isNumericStart ? parseInt(start) : null
    let endDot = isNumericEnd ? parseInt(end) : null

    if (startDot === null || endDot === null) {
      const resolved = await findLibraryDotsForRooms(
        startDot === null ? start : String(startDot),
        endDot === null ? end : String(endDot)
      )
      startDot = startDot === null ? resolved.startDot : startDot
      endDot = endDot === null ? resolved.endDot : endDot
    }

    if (startDot === null || endDot === null) {
      return res.status(404).json({ error: 'Start or destination not found in library' })
    }

    const nodes = await LibraryDesign.find({})
    const graph = buildGraph(nodes)

    const startFloor = Math.floor(startDot / 10)
    const endFloor = Math.floor(endDot / 10)

    let path = []
    if (startFloor === endFloor) {
      path = findShortestPath(graph, startDot, endDot)
    } else {
      path = floor_jump(graph, startDot, endDot, String(choice).toLowerCase())
    }

    if (path.length === 0) return res.status(404).json({ error: 'No path found' })

    const distance = generateDistance(path)
    const directions = generateDirections(graph, path)
    res.json({ path, distance, directions, startDot, endDot })
  } catch (err) {
    res.status(500).json({ error: 'Library pathfinding failed' })
  }
}

module.exports = { getAllLibraryNodes, getLibraryShortestPath, librarySearch }



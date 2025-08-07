const FloorDesign = require('../models/floorDesign.model')
const {
  buildGraph,
  findShortestPath,
  generateDirections,
  generateDistance,
} = require('../utils/pathfinder.utils')

async function getAllNodes(req, res) {
  try {
    const nodes = await FloorDesign.find({})
    res.json(nodes)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nodes' })
  }
}

async function getShortestPath(req, res) {
  try {
    const { start, end } = req.query
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end parameters' })
    }

    const nodes = await FloorDesign.find({})
    const graph = buildGraph(nodes)
    const path = findShortestPath(graph, parseInt(start), parseInt(end))

    if (path.length === 0) {
      return res.status(404).json({ error: 'No path found' })
    }

    const distance = generateDistance(path)
    const directions = generateDirections(graph, path)
    res.json({ path, distance, directions })
  } catch (err) {
    res.status(500).json({ error: 'Pathfinding failed' })
  }
}

module.exports = { getAllNodes, getShortestPath }

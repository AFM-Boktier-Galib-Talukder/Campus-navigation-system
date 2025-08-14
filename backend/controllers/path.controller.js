const FloorDesign = require('../models/floorDesign.model')
const { buildGraph } = require('../utils/graphBuilder.utils')
const { findShortestPath } = require('../utils/pathfinder.utils')
const { generateDirections } = require('../utils/directionGenerator.utils')
const {
  generateTime,
  pathDistance,
} = require('../utils/distanceCalculator.utils')
const { floor_jump } = require('../utils/floor_jump.utils')
const { findDots } = require('../utils/dot_finder.utils')
const { searching } = require('../utils/searching.utils')

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
    const { start, end, choice } = req.query
    if (!start || !end || !choice) {
      return res
        .status(400)
        .json({ error: 'Missing start, end, or choice parameters' })
    }

    console.log('from path.controller.js_______start', start, '____End', end)
    const { startDot, endDot } = await findDots(FloorDesign, start, end)

    if (startDot === null || endDot === null) {
      return res
        .status(404)
        .json({ error: 'Start or destination not found in floors' })
    }

    const nodes = await FloorDesign.find({})
    const graph = buildGraph(nodes)

    const startFloor = Math.floor(startDot / 10)
    const endFloor = Math.floor(endDot / 10)

    let path = []
    if (startFloor === endFloor) {
      path = findShortestPath(graph, startDot, endDot)
    } else {
      path = floor_jump(graph, startDot, endDot, String(choice).toLowerCase())
    }

    if (path.length === 0) {
      return res.status(404).json({ error: 'No path found' })
    }

    const distance = pathDistance(path)
    const time = generateTime(path)
    const directions = generateDirections(graph, path)
    res.json({
      path,
      distance: `${distance} meters`,
      time,
      directions,
      startDot,
      endDot,
    })
  } catch (err) {
    res.status(500).json({ error: 'Pathfinding failed' })
  }
}

async function searchRoomsController(req, res) {
  try {
    const { q } = req.query
    const results = await searching(FloorDesign, q)
    res.json({ results })
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
}

module.exports = { getAllNodes, getShortestPath, searchRoomsController }

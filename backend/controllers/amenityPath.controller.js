const FloorDesign = require('../models/floorDesign.model')
const { buildGraph } = require('../utils/graphBuilder.utils')
const { findShortestPath } = require('../utils/pathfinder.utils')
const { generateDirections } = require('../utils/directionGenerator.utils')
const {
  pathDistance,
  generateTime,
} = require('../utils/distanceCalculator.utils')
const { floor_jump } = require('../utils/floor_jump.utils')
const { findSingleDot } = require('../utils/dot_finder.utils')
const { resolveAmenityDestination } = require('../utils/amenity_finder.utils')

/**
 * Handles pathfinding specifically for amenities with floor-aware destination resolution
 */
async function getAmenityPath(req, res) {
  try {
    const { start, destination, transport } = req.query

    if (!start || !destination || !transport) {
      return res.status(400).json({
        error: 'Missing start, destination, or transport parameters',
      })
    }

    // Resolve start point to dot number (could be room name or dot number)
    const isNumericStart = /^\d+$/.test(String(start))
    let startDot = isNumericStart ? parseInt(start) : null

    if (startDot === null) {
      startDot = await findSingleDot(FloorDesign, start)
    }

    if (startDot === null) {
      return res.status(404).json({
        error: 'Start location not found in floors',
      })
    }

    // Resolve amenity destination based on start floor
    const endDot = await resolveAmenityDestination(destination, startDot)

    if (endDot === null) {
      return res.status(404).json({
        error: `${destination} not found on floor ${Math.floor(startDot / 10)}`,
      })
    }

    // Get all floor nodes and build graph
    const nodes = await FloorDesign.find({})
    const graph = buildGraph(nodes)

    const startFloor = Math.floor(startDot / 10)
    const endFloor = Math.floor(endDot / 10)

    let path = []
    if (startFloor === endFloor) {
      // Same floor: direct shortest path
      path = findShortestPath(graph, startDot, endDot)
    } else {
      // Different floors: use floor jump logic
      path = floor_jump(
        graph,
        startDot,
        endDot,
        String(transport).toLowerCase()
      )
    }

    if (path.length === 0) {
      return res.status(404).json({ error: 'No path found' })
    }

    // Generate response data
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
      amenityType: destination,
      startFloor: Math.floor(startDot / 10),
      endFloor: Math.floor(endDot / 10),
    })
  } catch (err) {
    console.error('Amenity pathfinding error:', err)
    res.status(500).json({ error: 'Amenity pathfinding failed' })
  }
}

module.exports = { getAmenityPath }

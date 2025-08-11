// const FloorDesign = require('../models/floorDesign.model')
// const {
//   buildGraph,
//   findShortestPath,
//   generateDirections,
//   generateDistance,
// } = require('../utils/pathfinder.utils')
// const { floor_jump } = require('../utils/floor_jump.utils')
// const { findDotsForRooms } = require('../utils/dot_finder.utils')

// async function getAllNodes(req, res) {
//   try {
//     const nodes = await FloorDesign.find({})
//     res.json(nodes)
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch nodes' })
//   }
// }

// async function getShortestPath(req, res) {
//   try {
//     const { start, end, choice } = req.query
//     if (!start || !end || !choice) {
//       return res
//         .status(400)
//         .json({ error: 'Missing start, end, or choice parameters' })
//     }

//     // Accept either numeric dots or room names. If not numeric, resolve via dot finder
//     const isNumericStart = /^\d+$/.test(String(start))
//     const isNumericEnd = /^\d+$/.test(String(end))

//     let startDot = isNumericStart ? parseInt(start) : null
//     let endDot = isNumericEnd ? parseInt(end) : null

//     if (startDot === null || endDot === null) {
//       const resolved = await findDotsForRooms(
//         startDot === null ? start : String(startDot),
//         endDot === null ? end : String(endDot)
//       )
//       startDot = startDot === null ? resolved.startDot : startDot
//       endDot = endDot === null ? resolved.endDot : endDot
//     }

//     if (startDot === null || endDot === null) {
//       return res
//         .status(404)
//         .json({ error: 'Start or destination not found in floors' })
//     }

//     const nodes = await FloorDesign.find({})
//     const graph = buildGraph(nodes)

//     const startFloor = Math.floor(startDot / 10)
//     const endFloor = Math.floor(endDot / 10)

//     let path = []
//     if (startFloor === endFloor) {
//       // Same floor: do not use floor_jump; do direct shortest path
//       path = findShortestPath(graph, startDot, endDot)
//     } else {
//       path = floor_jump(graph, startDot, endDot, String(choice).toLowerCase())
//     }

//     if (path.length === 0) {
//       return res.status(404).json({ error: 'No path found' })
//     }

//     const distance = generateDistance(path)
//     const directions = generateDirections(graph, path)
//     res.json({ path, distance, directions, startDot, endDot })
//   } catch (err) {
//     res.status(500).json({ error: 'Pathfinding failed' })
//   }
// }

// module.exports = { getAllNodes, getShortestPath }

const FloorDesign = require('../models/floorDesign.model')
const { buildGraph } = require('../utils/graphBuilder.utils')
const { findShortestPath } = require('../utils/pathFinder.utils')
const { generateDirections } = require('../utils/directionGenerator.utils')
const {
  generateTime,
  pathDistance,
} = require('../utils/distanceCalculator.utils')
const { floor_jump } = require('../utils/floor_jump.utils')
const { findDotsForRooms } = require('../utils/dot_finder.utils')

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

    const isNumericStart = /^\d+$/.test(String(start))
    const isNumericEnd = /^\d+$/.test(String(end))

    let startDot = isNumericStart ? parseInt(start) : null
    let endDot = isNumericEnd ? parseInt(end) : null

    if (startDot === null || endDot === null) {
      const resolved = await findDotsForRooms(
        startDot === null ? start : String(startDot),
        endDot === null ? end : String(endDot)
      )
      startDot = startDot === null ? resolved.startDot : startDot
      endDot = endDot === null ? resolved.endDot : endDot
    }

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

module.exports = { getAllNodes, getShortestPath }

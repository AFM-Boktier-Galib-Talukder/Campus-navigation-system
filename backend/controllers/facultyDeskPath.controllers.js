const FloorDesign = require('../models/facultyDeskPath.model')
const { findDotsForFaculties } = require('../utils/facultyDeskDotFinder.utils')
const { findDots } = require('../utils/dot_finder.utils')
const { findShortestPath } = require('../utils/pathfinder.utils')
const { getDirectionMessages } = require('../utils/facultyDeskDirection.utils')
const {
  pathDistance,
  generateTime,
} = require('../utils/facultyDeskDistanceCalculator.utils')
const { searching } = require('../utils/searching.utils')

async function findPathBetweenFaculties(req, res) {
  try {
    const { startInitial, endInitial } = req.body

    if (!startInitial || !endInitial) {
      return res
        .status(400)
        .json({ error: 'Both start and end initials are required' })
    }

    const { startDot, endDot } = await findDots(
      FloorDesign,
      startInitial,
      endInitial
    )
    console.log(
      'from facultyDEskPath.controllers.js Start dot = ',
      startDot,
      '____',
      'End dot = ',
      endDot
    )

    if (startDot === null || endDot === null) {
      return res
        .status(404)
        .json({ error: 'One or both faculty initials not found' })
    }

    const nodes = await FloorDesign.find({})
    console.log('from facultyDeskPath.controller ,,,,,,,,,,,nodes =  ', nodes)

    const path = findShortestPath(nodes, startDot, endDot)
    console.log('Shortest Path = ', path)

    if (path.length === 0) {
      return res
        .status(404)
        .json({ error: 'No path found between the specified faculty desks' })
    }

    console.log('endInitial = ', endInitial)
    const directions = getDirectionMessages(nodes, path, endInitial)
    const distance = pathDistance(path)
    const time = generateTime(path)

    const navigationSteps = directions.map((message, index) => ({
      direction:
        index === 0
          ? 'start'
          : index === directions.length - 1
            ? 'destination'
            : 'forward',
      message,
      angle: 0,
    }))

    res.json({
      path,
      steps: navigationSteps,
      distance: `${distance} m`,
      time,
    })
  } catch (error) {
    console.error('Error finding path:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function searchDesksController(req, res) {
  try {
    const { q } = req.query
    const results = await searching(FloorDesign, q)
    res.json({ results })
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
}

module.exports = {
  findPathBetweenFaculties,
  searchDesksController,
}

const express = require('express')
const floorRouter = express.Router()
const {
  getAllNodes,
  getShortestPath,
  searchRoomsController,
} = require('../controllers/path.controller')

floorRouter.get('/nodes', getAllNodes)
floorRouter.get('/path', getShortestPath)
floorRouter.get('/search', searchRoomsController)

module.exports = floorRouter

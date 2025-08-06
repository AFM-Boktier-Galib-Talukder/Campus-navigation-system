const express = require('express')
const floorRouter = express.Router()
const {
  getAllNodes,
  getShortestPath,
} = require('../controllers/path.controller')
//Routes

floorRouter.get('/nodes', getAllNodes)
floorRouter.get('/path', getShortestPath)

module.exports = floorRouter

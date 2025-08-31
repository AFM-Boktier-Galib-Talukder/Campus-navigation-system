const express = require('express')
const adminFloorRouter = express.Router()
const {
  getAllFloorDots,
  updateFloorDot,
  getFloorDotById,
} = require('../controllers/adminFloor.controller')

// Routes
adminFloorRouter.get('/dots', getAllFloorDots)
adminFloorRouter.get('/dots/:dotId', getFloorDotById)
adminFloorRouter.put('/dots/:dotId', updateFloorDot)

module.exports = adminFloorRouter

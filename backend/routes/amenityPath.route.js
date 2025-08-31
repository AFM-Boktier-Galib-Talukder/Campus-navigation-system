const express = require('express')
const router = express.Router()
const { getAmenityPath } = require('../controllers/amenityPath.controller')

// GET /api/amenity/path - Get shortest path to an amenity
router.get('/path', getAmenityPath)

module.exports = router

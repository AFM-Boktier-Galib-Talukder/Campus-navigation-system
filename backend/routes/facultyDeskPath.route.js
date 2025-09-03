const express = require('express')
const facultyDeskPathRouter = express.Router()
const {
  findPathBetweenFaculties,
  searchDesksController,
} = require('../controllers/facultyDeskPath.controllers')

facultyDeskPathRouter.post('/find-path', findPathBetweenFaculties)
facultyDeskPathRouter.get('/search', searchDesksController)

module.exports = facultyDeskPathRouter

const express = require('express')
const libraryRouter = express.Router()
const {
  getAllLibraryNodes,
  getLibraryShortestPath,
  librarySearch,
} = require('../controllers/library.controller')

libraryRouter.get('/nodes', getAllLibraryNodes)
libraryRouter.get('/path', getLibraryShortestPath)
libraryRouter.get('/search', librarySearch)

module.exports = libraryRouter



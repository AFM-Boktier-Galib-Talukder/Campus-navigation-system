const express = require('express')
const reportRouter = express.Router()
const {
  createReport,
  listReports,
  deleteReport,
} = require('../controllers/report.controller')
const upload = require('../middlewares/upload')

reportRouter.get('/', listReports)
reportRouter.post('/', upload.single('eventImage'), createReport)
reportRouter.delete('/:id', deleteReport)

module.exports = reportRouter

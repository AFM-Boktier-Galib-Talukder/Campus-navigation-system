const express = require('express')
const reportRouter = express.Router()
const { createReport, listReports, deleteReport } = require('../controllers/report.controller')

reportRouter.get('/', listReports)
reportRouter.post('/', createReport)
reportRouter.delete('/:id', deleteReport)

module.exports = reportRouter
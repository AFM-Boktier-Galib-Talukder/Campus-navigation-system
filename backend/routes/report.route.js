const express = require('express')
const reportRouter = express.Router()
const { createReport } = require('../controllers/report.controller')

reportRouter.post('/', createReport)

module.exports = reportRouter
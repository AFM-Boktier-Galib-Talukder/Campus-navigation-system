const express = require('express')
const billboardRouter = express.Router()
const { createBillboard, listBillboards } = require('../controllers/billboard.controller')

billboardRouter.post('/', createBillboard)
billboardRouter.get('/', listBillboards)

module.exports = billboardRouter
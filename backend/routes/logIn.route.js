const express = require('express')
const logInRouter = express.Router()
const { CheckEmailAndPassword } = require('../controllers/login.controller')

logInRouter.route('/').post(CheckEmailAndPassword)

module.exports = logInRouter

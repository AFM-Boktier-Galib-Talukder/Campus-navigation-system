const express = require('express')
const logInRouter = express.Router()
const { CheckEmailAndPassword } = require('../controllers/login.controller')

//Routes
logInRouter.route('/').post(CheckEmailAndPassword)

module.exports = logInRouter

const express = require('express')
const signUpRouter = express.Router()
const {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateNewUser,
} = require('../controllers/signup.controller')

//Routes
signUpRouter.route('/').get(GetAllUsers).post(CreateNewUser)

signUpRouter
  .route('/:id')
  .get(GetUserById)
  .patch(UpdateUserById)
  .delete(DeleteUserById)

module.exports = signUpRouter

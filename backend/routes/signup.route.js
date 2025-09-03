const express = require('express')
const signUpRouter = express.Router()
const {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateNewUser,
  GetUsersByEmail,
} = require('../controllers/signup.controller')

signUpRouter.route('/').get(GetAllUsers).post(CreateNewUser)

signUpRouter
  .route('/:id')
  .get(GetUserById)
  .patch(UpdateUserById)
  .delete(DeleteUserById)

signUpRouter.route('/email/:email').get(GetUsersByEmail)

module.exports = signUpRouter

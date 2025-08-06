const express = require('express')
const router = express.Router()
const {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateNewUser,
} = require('../controllers/user.controller')

//Routes
router.route('/').get(GetAllUsers).post(CreateNewUser)

router
  .route('/:id')
  .get(GetUserById)
  .patch(UpdateUserById)
  .delete(DeleteUserById)

module.exports = router

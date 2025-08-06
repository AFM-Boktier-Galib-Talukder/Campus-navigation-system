const User = require('../models/user.model')

async function GetAllUsers(req, res) {
  const allDbUsers = await User.find({})
  return res.json(allDbUsers)
}

async function GetUserById(req, res) {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  return res.json(user)
}

async function UpdateUserById(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, {
    last_name: 'Changed?',
  })
  return res.json({ status: 'Successfully updated' })
}

async function DeleteUserById(req, res) {
  const user = await User.findByIdAndDelete(req.params.id)
  return res.json({ status: `Successfully deleted` })
}

async function CreateNewUser(req, res) {
  const body = req.body
  if (!body || !body.first_name || !body.last_name) {
    return res.status(400).json({ error: 'Both name is require' })
  }
  console.log('Body', body)
  const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
  })
  console.log('Result', result)
  return res.status(201).json({ msg: 'success' })
}

module.exports = {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateNewUser,
}

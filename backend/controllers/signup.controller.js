const User = require('../models/login_signup.model')
const { validateEmail } = require('../utils/emailValidator')
const { validatePassword } = require('../utils/passwordValidator')

async function CreateNewUser(req, res) {
  const body = req.body

  const emailError = validateEmail(body.email)
  if (emailError) {
    return res.status(400).json({
      error: emailError,
    })
  }

  const passwordError = validatePassword(body.password)
  if (passwordError) {
    return res.status(400).json({
      error: passwordError,
    })
  }

  console.log('from signup.controller,,,,,,,Body', body)

  try {
    const result = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
    })

    console.log('Result', result)
    return res.status(201).json({ msg: 'success' })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({
      error: 'Failed to create user',
    })
  }
}

async function GetUsersByEmail(req, res) {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

//?Extra endpoints//////////////////////////////////////////////////
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

module.exports = {
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  CreateNewUser,
  GetUsersByEmail,
}

const User = require('../models/login_signup.model')

async function CheckEmailAndPassword(req, res) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json('No record exists with this email')
    }

    if (user.password !== password) {
      return res.status(401).json('The password is incorrect')
    }

    res.status(200).json({
      status: 'Success',
      role: user.role,
      userId: user._id,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json('An error occurred during login')
  }
}

module.exports = { CheckEmailAndPassword }

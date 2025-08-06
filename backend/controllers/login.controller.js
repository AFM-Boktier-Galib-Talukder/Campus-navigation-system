const User = require('../models/login_signup.model')

async function CheckEmailAndPassword(req, res) {
  const { email, password } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {
      if (user.password === password) {
        res.status(200).json('Success')
      } else {
        res.status(401).json('The Password is incorrect')
      }
    } else {
      res.status(406).json('No record existed')
    }
  })
}
module.exports = { CheckEmailAndPassword }

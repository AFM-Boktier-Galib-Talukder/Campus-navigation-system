const express = require('express')
const { logReqRes } = require('./middlewares/index')
const { connectMongoDB } = require('./connection')
const signUpRouter = require('./routes/signup.route')
const logInRouter = require('./routes/logIn.route')
const floorRouter = require('./routes/floorDesign.route')

const app = express()
const PORT = 1490

//Connection
connectMongoDB()
  .then(() => console.log('MongoDB Connected✅'))
  .catch(err => {
    console.log('Mongo Error', err)
  })

//MiddleWare
app.use(express.urlencoded({ extended: false }))
app.use(logReqRes('log.txt'))

//Routes
app.use('/api/floor', floorRouter)
app.use('/api/signup', signUpRouter)
app.use('/api/login', logInRouter)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { logReqRes } = require('./middlewares/index')
const { connectMongoDB } = require('./connection')
const signUpRouter = require('./routes/signup.route')
const logInRouter = require('./routes/logIn.route')
const floorRouter = require('./routes/floorDesign.route')
const libraryRouter = require('./routes/library.route')
const facultyDeskRouter = require('./routes/facultyDesk.route')
const reportRouter = require('./routes/report.route')
const billboardRouter = require('./routes/billboard.route')

const app = express()
const PORT = 1490

//Connection
connectMongoDB()
  .then(() => console.log('MongoDB Connected✅'))
  .catch(err => {
    console.log('Mongo Error', err)
  })

//MiddleWare
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(logReqRes('log.txt'))

//Routes
app.use('/api/floor', floorRouter)
app.use('/api/library', libraryRouter)
app.use('/api/signup', signUpRouter)
app.use('/api/login', logInRouter)
app.use('/api/facultyDesk', facultyDeskRouter)
app.use('/api/reports', reportRouter)
app.use('/api/billboards', billboardRouter)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

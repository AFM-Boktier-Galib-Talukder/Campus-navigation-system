const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const { logReqRes } = require('./middlewares/index')
const { connectMongoDB } = require('./connection')
const signUpRouter = require('./routes/signup.route')
const logInRouter = require('./routes/logIn.route')
const floorRouter = require('./routes/floorDesign.route')
const libraryRouter = require('./routes/library.route')
const facultyDeskRouter = require('./routes/facultyDesk.route')
const reportRouter = require('./routes/report.route')
const billboardRouter = require('./routes/billboard.route')
const adminFloorRouter = require('./routes/adminFloor.route')
const amenityPathRouter = require('./routes/amenityPath.route')

const app = express()
const PORT = 1490

//Connection
connectMongoDB()
  .then(() => console.log('MongoDB Connected✅'))
  .catch(err => {
    console.log('Mongo Error', err)
  })

//MiddleWare
app.use(bodyParser.json({ limit: '50mb' })) // Increased limit for large base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())
app.use(logReqRes('log.txt'))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//Routes
app.use('/api/floor', floorRouter)
app.use('/api/library', libraryRouter)
app.use('/api/signup', signUpRouter)
app.use('/api/login', logInRouter)
app.use('/api/facultyDesk', facultyDeskRouter)
app.use('/api/reports', reportRouter)
app.use('/api/billboards', billboardRouter)
app.use('/api/admin/floor', adminFloorRouter)
app.use('/api/amenity', amenityPathRouter)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

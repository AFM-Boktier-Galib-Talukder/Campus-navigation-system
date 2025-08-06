const express = require('express')
const { logReqRes } = require('./middlewares/index')
const { connectMongoDB } = require('./connection')
const userRouter = require('./routes/user.route')

const app = express()
const PORT = 8000

//Connection
connectMongoDB().then(() => console.log('MongoDB Connected✅')).catch(err => {console.log('Mongo Error', err)})

//MiddleWare
app.use(express.urlencoded({ extended: false }))
app.use(logReqRes('log.txt'))

//Routes
app.use('/api/user', userRouter)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressFileUpload = require('express-fileupload')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: "*",
    // origin: "http://127.0.0.1:5173",
    // origin: "https://devam-backend.vercel.app",
    credentials: true,
}))

app.use(morgan("tiny"))
app.use(cookieParser())
app.use(expressFileUpload({
    tempFileDir: "/tmp/",
    useTempFiles: true,
    limits: 5*1024*1024
}))

//routes
const userRoutes = require('./routes/user')
const deviceRoutes = require('./routes/device')

app.use("/api/v1", userRoutes)
app.use("/api/v1/admin", deviceRoutes)


module.exports = app
const express = require('express')
const connectDb = require('./config/db')
require('dotenv').config()
const app = require('./app')

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
    connectDb()
})
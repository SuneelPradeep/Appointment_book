require('dotenv').config()
const express = require('express')
const cors = require('cors')
const API = require('./routes/api')

const app = express()
const PORT = process.env.PORT
app.use(cors())
app.use(express.json())
app.use('/',API)


app.listen(PORT,()=>{
    console.info('connected to Server')  
})
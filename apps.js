// Dotenv
require('dotenv').config()

//cors
// const cors = require('cors');

// Express App
const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT_HOST

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// // Middleware
// const { authenticationAPIKey } = require('./src/middleware/authService')

// // Router
// const router_v1 = require('./src/router/v1/routes')
// app.use('/api/logs/v1', authenticationAPIKey, router_v1)

// App General

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Application ready with port ${port}`)
})
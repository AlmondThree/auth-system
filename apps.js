// Dotenv
require('dotenv').config()

//cors
const cors = require('cors');

// Express App
const express = require('express')

const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT_HOST

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// Middleware
const { authenticationAPIKey } = require('./src/middleware/authService')
const { responseHandler } = require('./src/middleware/responseHandler')

// Router
const router_v1 = require('./src/router/v1/mainRoutes')
app.use('/api/auth/v1', authenticationAPIKey, router_v1, responseHandler)

// App General

app.all('/*', (req, res) => {
    res.status(404)
    res.send('not found')
})

app.listen(port, () => {
    console.log(`Application ready with port ${port}`)
})
const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config({
    path: './config/.env'
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes will go here

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
})

app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/agent', require('./routes/agentRoutes'));
app.use('/api/v1/payment', require('./routes/paymentRoutes'));
app.use('/api/v1/prediction', require('./routes/predictionRoutes'));

module.exports = app;
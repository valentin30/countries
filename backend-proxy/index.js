require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const HOST = 'localhost'
const PORT = process.env.PORT
const API_SERVICE_URL = process.env.API_SERVICE_URL

const app = express()

app.use(cors())

app.use('/countries', createProxyMiddleware({ target: API_SERVICE_URL, changeOrigin: true }))

app.listen(PORT, HOST, () => {})

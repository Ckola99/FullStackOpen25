const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

// --- Database Connection ---
logger.info('connecting to', config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI, { family: 4 })
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connection to MongoDB:', error.message)
	})

// --- Middleware Setup ---
app.use(express.json()) // JSON parser for request body

// Attach the router: all requests starting with /api/blogs go to blogsRouter
app.use('/api/blogs', blogsRouter)

module.exports = app

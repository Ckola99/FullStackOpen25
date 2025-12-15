const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const userExtractor = require('./utils/middleware').userExtractor

const app = express()
const middleware = require('./utils/middleware')


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

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// Attach the router: all requests starting with /api/blogs go to blogsRouter
app.use('/api/blogs', middleware.tokenExtractor, userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

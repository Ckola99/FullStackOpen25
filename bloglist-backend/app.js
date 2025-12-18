const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')

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

const allowedOrigins = [
	'http://localhost:5173',
	'https://full-stack-open25.vercel.app'
];
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	}
};

// --- Middleware Setup ---
app.use(cors(corsOptions))
app.use(express.json()) // JSON parser for request body

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
// Attach the router: all requests starting with /api/blogs go to blogsRouter
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

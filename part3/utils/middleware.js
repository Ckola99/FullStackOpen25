const logger = require('./logger')
const morgan = require('morgan')
const config = require('./config')

// custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body))
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body'

const requestLogger = morgan(morganFormat)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
}

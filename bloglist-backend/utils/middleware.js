const logger = require('./logger') // Assuming you adjust logger.js to export info/error

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		// <--- CRITICAL FIX FOR TASK 4.12: Captures validation errors and returns 400
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

module.exports = {
	unknownEndpoint,
	errorHandler
}

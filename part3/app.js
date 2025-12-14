const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')


const app = express()

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

app.use(cors(corsOptions))
app.use(express.static('dist'))
app.use(express.json())

// Use the requestLogger created in middleware.js (which uses morgan)
app.use(middleware.requestLogger)

// --- Route Attach ---

app.get('/', (req, res) => {
	res.send('<h1>Phonebook Backend Operational</h1>')
})

// 2. Info page handler
app.get('/info', (req, res, next) => {
	Person.countDocuments({})
		.then(count => {
			const date = new Date()
			res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            `)
		})
		.catch(error => next(error))
})

// The personsRouter handles all paths beginning with /api/persons
app.use('/api/persons', personsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

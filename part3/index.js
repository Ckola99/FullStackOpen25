require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://full-stack-open25.vercel.app'
]

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  }
}


// custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body))
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan(morganFormat))


app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend Operational</h1>')
})

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

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const personUpdate = { name, number }

  Person.findByIdAndUpdate(req.params.id, personUpdate, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

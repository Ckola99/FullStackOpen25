const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

personRouter.get('/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if (person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(error => next(error))
})

personRouter.delete('/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

personRouter.post('/', (req, res, next) => {
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

personRouter.put('/:id', (req, res, next) => {
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


module.exports = personRouter

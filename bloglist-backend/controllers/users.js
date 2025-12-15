const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users)
})

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body

	// 1. Validate password BEFORE hashing
	if (!password) {
		return response.status(400).json({ error: 'Password is required' })
	}

	if (password.length < 8) {
		return response.status(400).json({ error: 'Password must be at least 8 characters long' })
	}

	// Optional complexity rules
	// if (!/[A-Z]/.test(password)) {
	//   return response.status(400).json({ error: 'Password must contain at least one uppercase letter' })
	// }
	// if (!/[0-9]/.test(password)) {
	//   return response.status(400).json({ error: 'Password must contain at least one number' })
	// }

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await user.save()

	response.status(201).json(savedUser)
})

module.exports = usersRouter

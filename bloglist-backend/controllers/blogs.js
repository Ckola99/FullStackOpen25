const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
	try {
		const blog = new Blog(request.body)
		const savedBlog = await blog.save()
		response.status(201).json(savedBlog)
	} catch (error) {
		next(error)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	try {
		// Find the blog by ID and delete it
		await Blog.findByIdAndDelete(request.params.id)

		// Respond with 204 No Content, as deletion was successful
		response.status(204).end()
	} catch (error) {
		// Pass to error handling middleware (for CastError, etc.)
		next(error)
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	try {
		const { title, author, url, likes } = request.body

		const blogUpdate = {
			title,
			author,
			url,
			likes, // Include the likes field to allow updating
		}

		// findByIdAndUpdate takes the ID, the new object, and options
		// { new: true } returns the updated document, not the original.
		// { runValidators: true } ensures Mongoose runs schema validation on the update.
		const updatedBlog = await Blog.findByIdAndUpdate(
			request.params.id,
			blogUpdate,
			{ new: true, runValidators: true, context: 'query' }
		)

		if (updatedBlog) {
			response.json(updatedBlog)
		} else {
			response.status(404).end() // ID format valid, but not found
		}
	} catch (error) {
		// Pass to error handling middleware (for CastError or ValidationError)
		next(error)
	}
})
module.exports = blogsRouter

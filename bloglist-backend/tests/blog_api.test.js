const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

// --- Database Initialization ---

beforeEach(async () => {
	// 1. Clear the database
	await Blog.deleteMany({})

	// 2. Insert initial data using Mongoose's efficient insertMany
	await Blog.insertMany(helper.initialBlogs)
})


describe('when there are initially some blogs saved', () => {

	test('blogs are returned as json and have the correct count', async () => {
		// Use await with Supertest request chain
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)

		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})

	test('all blogs have an identifier field named "id" (4.9)', async () => {
		const response = await api.get('/api/blogs')
		const firstBlog = response.body[0]
		assert(firstBlog.id, 'The id property should exist')
		assert.strictEqual(firstBlog._id, undefined, 'The _id property should not exist')
	})


	test('a valid blog can be added', async () => {
		const newBlog = {
			title: "Async/Await Magic",
			author: "The Professor",
			url: "http://await.com/magic",
			likes: 99
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		const titles = blogsAtEnd.map(b => b.title)

		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
		assert(titles.includes('Async/Await Magic'))
	})

	test('if the likes property is missing, it defaults to 0 (4.11)', async () => {
		const blogWithoutLikes = {
			title: "No likes blog",
			author: "Anonymous",
			url: "http://nolikes.com",
			// likes is omitted
		}

		const response = await api
			.post('/api/blogs')
			.send(blogWithoutLikes)
			.expect(201)

		assert.strictEqual(response.body.likes, 0)

		const blogsAtEnd = await helper.blogsInDb()
		const savedBlog = blogsAtEnd.find(b => b.title === 'No likes blog')
		assert.strictEqual(savedBlog.likes, 0)
	})


	test('POST fails with status 400 if title is missing', async () => {
		const blogWithoutTitle = {
			author: "Failure",
			url: "http://missing.com",
			likes: 1
		}

		await api
			.post('/api/blogs')
			.send(blogWithoutTitle)
			.expect(400) // Expect 400 Bad Request

		// Ensure database count did not change
		const blogsAtEnd = await helper.blogsInDb()
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})

	test('POST fails with status 400 if url is missing', async () => {
		const blogWithoutUrl = {
			title: "Missing URL",
			author: "Failure",
			likes: 1
		}

		await api
			.post('/api/blogs')
			.send(blogWithoutUrl)
			.expect(400)

		// Ensure database count did not change
		const blogsAtEnd = await helper.blogsInDb()
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})
})

describe('deletion of a blog', () => {

	test('succeeds with status 204 if id is valid and exists', async () => {
		// Get the list of all blogs currently in the database
		const blogsAtStart = await helper.blogsInDb()
		// Select the first blog to delete
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204) // Expect No Content status

		// Check the database state after deletion
		const blogsAtEnd = await helper.blogsInDb()

		// 1. Check if the count decreased by one
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

		// 2. Check if the deleted blog's ID is missing from the end list
		const ids = blogsAtEnd.map(b => b.id)
		assert(!ids.includes(blogToDelete.id))
	})

	test('fails with status 400 if id is invalid (CastError)', async () => {
		const invalidId = '5a3d5da59070081a82a3445' // Malformed ID (too short, wrong format)

		await api
			.delete(`/api/blogs/${invalidId}`)
			.expect(400) // Expect Bad Request (handled by middleware)

		// Ensure database count did not change
		const blogsAtEnd = await helper.blogsInDb()
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})

	test('succeeds with status 204 if id is valid but does not exist', async () => {
		// MongoDB's findByIdAndDelete is idempotent; deleting a non-existent ID
		// results in a count of 0 deleted items, but the operation itself is successful (204).
		const nonExistentId = '600000000000000000000000'

		await api
			.delete(`/api/blogs/${nonExistentId}`)
			.expect(204)

		// Ensure database count did not change
		const blogsAtEnd = await helper.blogsInDb()
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})
})

describe('updating a blog', () => {

	test('succeeds with status 200 and correctly updates likes', async () => {
		// Get blog to update
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0] // Blog 1: "React patterns", likes: 7

		const newLikes = blogToUpdate.likes + 5
		const updatedData = { ...blogToUpdate, likes: newLikes }

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedData)
			.expect(200) // Expect OK status
			.expect('Content-Type', /application\/json/)

		// Fetch the updated blog from the database
		const blogsAtEnd = await helper.blogsInDb()
		const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

		// 1. Check if the likes field was updated
		assert.strictEqual(updatedBlogInDb.likes, newLikes)

		// 2. Check if the other fields remain the same (deep check)
		assert.strictEqual(updatedBlogInDb.title, blogToUpdate.title)
	})

	test('fails with status 400 if ID is malformed (CastError)', async () => {
		const invalidId = '5a3d5da59070081a82a3445'
		const dummyUpdate = { title: 'Test', author: 'Test', url: 'http://test.com', likes: 1 }

		await api
			.put(`/api/blogs/${invalidId}`)
			.send(dummyUpdate)
			.expect(400) // Expect Bad Request
	})

	test('fails with status 404 if ID is valid but does not exist', async () => {
		const nonExistentId = '600000000000000000000000'
		const dummyUpdate = { title: 'Test', author: 'Test', url: 'http://test.com', likes: 1 }

		await api
			.put(`/api/blogs/${nonExistentId}`)
			.send(dummyUpdate)
			.expect(404) // Expect Not Found
	})
})

describe('when there is initially one user at db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })

		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		assert(usernames.includes(newUser.username))
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		assert(result.body.error.includes('expected `username` to be unique'))

		assert.strictEqual(usersAtEnd.length, usersAtStart.length)
	})
})

after(async () => {
	// Close the connection after all tests in this file are done
	await mongoose.connection.close()
})

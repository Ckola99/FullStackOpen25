const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

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

	// --- Task 4.11: Default Likes to Zero ---

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

after(async () => {
	// Close the connection after all tests in this file are done
	await mongoose.connection.close()
})

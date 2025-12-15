const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5
	},
]

// Returns all blogs currently in the DB
const blogsInDb = async () => {
	const blogs = await Blog.find({})

	// Use .map(blog => blog.toJSON()) to ensure the Mongoose object is converted to a plain object
	// that has the 'id' field instead of '_id' and '__v'
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}


module.exports = {
	initialBlogs,
	blogsInDb,
	usersInDb
}

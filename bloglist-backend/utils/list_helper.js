const _ = require('lodash')

const dummy = () => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return null
	}

	const favorite = blogs.reduce((maxLikesBlog, currentBlog) => {
		return currentBlog.likes > maxLikesBlog.likes ? currentBlog : maxLikesBlog
	}, blogs[0])

	return favorite
}

const mostBlogs = (blogs) => {
	if (!blogs || blogs.length === 0) {
		return null
	}

	// Group blogs by author: { 'Michael Chan': [blog1], 'Edsger W. Dijkstra': [blog2, blog3], ... }
	const blogsByAuthor = _.groupBy(blogs, 'author')

	// Map groups into the desired format: [{ author: 'Michael Chan', blogs: 1 }, ...]
	const authorBlogCounts = _.map(blogsByAuthor, (blogs, author) => ({
		author: author,
		blogs: blogs.length,
	}))

	const topBlogger = _.maxBy(authorBlogCounts, 'blogs')
	return topBlogger
}

const mostLikes = (blogs) => {
	if (!blogs || blogs.length === 0) {
		return null
	}

	const likesByAuthor = _.groupBy(blogs, 'author')

	const authorLikeCounts = _.map(likesByAuthor, (blogs, author) => ({
		author: author,
		likes: _.sumBy(blogs, 'likes'),
	}))

	const topAuthor = _.maxBy(authorLikeCounts, 'likes')
	return topAuthor
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }

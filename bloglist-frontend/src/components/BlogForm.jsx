import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ blogs, setBlogs, notify, onSuccess }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const handleCreateBlog = async (event) => {
		event.preventDefault()

		const blogObject = { title, author, url }
		const returnedBlog = await blogService.create(blogObject)

		setBlogs(blogs.concat(returnedBlog))
		notify(`a new blog ${title} by ${author} added`)

		setTitle('')
		setAuthor('')
		setUrl('')

		onSuccess()
	}

	return (
		<form onSubmit={handleCreateBlog}>
			<div>
				title:
				<input value={title} onChange={({ target }) => setTitle(target.value)} />
			</div>
			<div>
				author:
				<input value={author} onChange={({ target }) => setAuthor(target.value)} />
			</div>
			<div>
				url:
				<input value={url} onChange={({ target }) => setUrl(target.value)} />
			</div>
			<button type="submit">create</button>
		</form>
	)
}

export default BlogForm

import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ onSuccess, createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const handleCreateBlog = (event) => {
		event.preventDefault()

		// Call the function passed via props
		createBlog({
			title: title,
			author: author,
			url: url
		})

		// Reset local state
		setTitle('')
		setAuthor('')
		setUrl('')

		onSuccess()
	}

	return (
		<form onSubmit={handleCreateBlog}>
			<div>
				title:
				<input value={title} onChange={({ target }) => setTitle(target.value)} placeholder='title-input'/>
			</div>
			<div>
				author:
				<input value={author} onChange={({ target }) => setAuthor(target.value)} placeholder='author-input'/>
			</div>
			<div>
				url:
				<input value={url} onChange={({ target }) => setUrl(target.value)} placeholder='url-input'/>
			</div>
			<button type="submit">create</button>
		</form>
	)
}

export default BlogForm

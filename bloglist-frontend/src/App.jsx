import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	const [notification, setNotification] = useState({ message: null, type: null })

	const blogFormRef = useRef()

	// ---------------- NOTIFICATIONS ----------------
	const notify = (message, type = 'info') => {
		setNotification({ message, type })
		setTimeout(() => {
			setNotification({ message: null, type: null })
		}, 5000)
	}

	// ---------------- FETCH BLOGS ----------------
	useEffect(() => {
		blogService.getAll().then(blogs => {
			const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
			setBlogs(sortedBlogs)
		})
	}, [])

	// ---------------- RESTORE LOGIN ----------------
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	// ---------------- LOGIN ----------------
	const handleLogin = async (event) => {
		event.preventDefault()
		try {
			const user = await loginService.login({ username, password })
			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			notify('wrong username or password', 'error')
		}
	}

	// ---------------- LOGOUT ----------------
	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser')
		setUser(null)
	}

	const likeBlog = async (blog) => {
		const updatedBlog = {
			...blog,
			user: blog.user.id,
			likes: blog.likes + 1,
		}

		const returnedBlog = await blogService.update(blog.id, updatedBlog)
		returnedBlog.user = blog.user

		const updatedBlogs = blogs.map(b => b.id === blog.id ? returnedBlog : b)
		setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
	}

	const deleteBlog = async (blog) => {
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
			try {
				await blogService.remove(blog.id)
				setBlogs(blogs.filter(b => b.id !== blog.id))
				notify(`Blog ${blog.title} was successfully deleted`, 'info')
			} catch (exception) {
				notify('Error: Could not delete the blog', 'error')
			}
		}
	}

	const addBlog = async (blogObject) => {
		try {
			const returnedBlog = await blogService.create(blogObject)
			setBlogs(blogs.concat(returnedBlog))
			notify(`a new blog ${blogObject.title} by ${blogObject.author} added`)
			blogFormRef.current.toggleVisibility()
		} catch (exception) {
			notify('error adding blog', 'error')
		}
	}

	return (
		<div>
			<h1>Blogs</h1>

			{notification.message && (
				<div className={`notification ${notification.type}`}>
					{notification.message}
				</div>
			)}

			{user === null ? (
				<LoginForm
					handleLogin={handleLogin}
					username={username}
					password={password}
					setUsername={setUsername}
					setPassword={setPassword}
				/>
			) : (
				<div>
					<p>
						{user.name} logged in
						<button onClick={handleLogout}>logout</button>
					</p>

					<Togglable buttonLabel="create new blog" ref={blogFormRef}>
						<BlogForm
							blogs={blogs}
							setBlogs={setBlogs}
							notify={notify}
							onSuccess={() => blogFormRef.current.toggleVisibility()}
							createBlog={addBlog}
						/>
					</Togglable>

					{blogs.map(blog => (
						<Blog key={blog.id} blog={blog} onLike={() => likeBlog(blog)} onDelete = {() => deleteBlog(blog)} currentUser={user}/>
					))}
				</div>
			)}
		</div>
	)
}

export default App

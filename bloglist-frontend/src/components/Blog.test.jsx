import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('renders content', () => {
	const blog = {
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		user: "Arto Hellas"
	}

	render(<Blog blog={blog} />)

	const element = screen.getByText('React patterns Michael Chan')
	expect(element).toBeDefined()
})

test('clicking the button displays URL and likes', async () => {
	const blog = {
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		user: {
			username: "mluukkai",
			name: "Matti Luukkainen"
		}
	}

	const mockUser = {
		username: "mluukkai",
		name: "Matti Luukkainen"
	}

	render(<Blog blog={blog} currentUser={mockUser} />)

	const user = userEvent.setup()
	const button = screen.getByText('view')
	await user.click(button)

	const urlElement = screen.getByText('https://reactpatterns.com/')
	expect(urlElement).toBeDefined()

	const likesElement = screen.getByText('likes 7')
	expect(likesElement).toBeDefined()

	const userElement = screen.getByText('mluukkai')
	expect(userElement).toBeDefined()
})

test('clicking the like button twice calls the event handler twice', async () => {
	const blog = {
		title: "Testing like button",
		author: "Test Author",
		url: "https://test.com",
		likes: 0,
		user: { username: "tester" }
	}

	const mockUser = { username: "tester" }
	const mockHandler = vi.fn()

	render(
		<Blog blog={blog} currentUser={mockUser} onLike={mockHandler} />
	)

	const user = userEvent.setup()


	const viewButton = screen.getByText('view')
	await user.click(viewButton)


	const likeButton = screen.getByText('like')
	await user.click(likeButton)
	await user.click(likeButton)

	// Assert that the handler was called exactly twice
	expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
	const createBlog = vi.fn()
	const user = userEvent.setup()

	render(<BlogForm createBlog={createBlog} />)

	// Use getByRole or querySelector to find the inputs
	const titleInput = screen.getByPlaceholderText('title-input')
	const authorInput = screen.getByPlaceholderText('author-input')
	const urlInput = screen.getByPlaceholderText('url-input')
	const sendButton = screen.getByText('create')


	await user.type(titleInput, 'Testing Form Title')
	await user.type(authorInput, 'Testing Form Author')
	await user.type(urlInput, 'www.testurl.com')

	await user.click(sendButton)

	expect(createBlog.mock.calls).toHaveLength(1)


	expect(createBlog.mock.calls[0][0].title).toBe('Testing Form Title')
	expect(createBlog.mock.calls[0][0].author).toBe('Testing Form Author')
	expect(createBlog.mock.calls[0][0].url).toBe('www.testurl.com')
})

import React from 'react'

const Login = ({ handleLogin, password, username, setPassword, setUsername }) => {
	return (
		<div>
			<form onSubmit={handleLogin}>
				<div className="input">
					<label htmlFor="username">
						username
					</label>
					<input type="text" data-testid="username" value={username} onChange={({ target }) => setUsername(target.value)} />

				</div>
				<div className="input">
					<label htmlFor="password">
						password
					</label>
					<input type="password" data-testid="password" value={password} onChange={({ target }) => setPassword(target.value)} />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default Login

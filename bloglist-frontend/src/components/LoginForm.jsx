import React from 'react'

const Login = ({ handleLogin, password, username, setPassword, setUsername }) => {
	return (
		<div>
			<form onSubmit={handleLogin}>
				<div className="input">
					username
					<input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
				</div>
				<div className="input">
					password
					<input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default Login

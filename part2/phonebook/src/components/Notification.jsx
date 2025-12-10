const Notification = ({ message, isError }) => {
	if (message === null) {
		return null;
	}

	const className = isError ? 'error' : 'notification';

	return (
		<div className={className}>
			{message}
		</div>
	);
};

export default Notification;

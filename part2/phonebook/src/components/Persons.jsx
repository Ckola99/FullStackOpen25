import React from 'react'

const Persons = ({ personsToShow, handleDelete }) => {

	console.log("Here are the people: ", personsToShow);
	
	return (
		<div className="">
			{personsToShow.map((person) =>
				<p key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>
			)}
		</div>
	)
}

export default Persons

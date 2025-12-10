import React from 'react'

const Filter = ({ filter, handleFilterChange}) => {
	return (<div className="">
		filter shown with <input value={filter} onChange={handleFilterChange} />
	</div>)
}

export default Filter

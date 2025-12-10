const Display = ({ shownCountries, filter, selectedCountryName, setSelectedCountryName, CountryDetails }) => {
	const numCountries = shownCountries.length;

	if (filter === '' && numCountries > 0) {
		return <p>Start typing in the search box to find countries.</p>;
	}

	const handleShowClick = (countryName) => {
		setSelectedCountryName(countryName === selectedCountryName ? null : countryName);
	};

	if (numCountries > 10) {
		return <p>Too many matches, specify another filter</p>;
	}

	if (numCountries >= 2) {
		return (
			shownCountries.map(country => {
				const isSelected = country.name.common === selectedCountryName;

				return (
					<div key={country.name.common}>
						{country.name.common} {" "}
						<button onClick={() => handleShowClick(country.name.common)}>
							{isSelected ? 'hide' : 'show'}
						</button>
						{isSelected && <CountryDetails country={country} />}
					</div>
				)
			})
		);
	}

	if (numCountries === 1) {
		const country = shownCountries[0]
		return <CountryDetails country={country} />
	}

	return <p>No countries match your search.</p>
}

export default Display

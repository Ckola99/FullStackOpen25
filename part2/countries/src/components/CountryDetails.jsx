import React, { useState, useEffect } from 'react';
import weatherService from '../services/weather';

const CountryDetails = ({ country }) => {
	const [weather, setWeather] = useState(null);
	const capital = country.capital[0];

	useEffect(() => {
		setWeather(null);

		weatherService
			.getWeather(capital)
			.then(weatherData => {
				setWeather(weatherData);
			})
			.catch(error => {
				console.error("Error fetching weather:", error);
				setWeather(null);
			});
	}, [capital]);

	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>capital {country.capital[0]} <br /> area {country.area}</p>

			<h3>languages:</h3>
			<ul>
				{Object.values(country.languages).map(lang =>
					<li key={lang}>{lang}</li>
				)}
			</ul>
			<img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="150" />
			<h2>Weather in {capital}</h2>
			{weather ? (
				<div>
					<p>temperature {weather.main.temp} Celsius</p>
					{weather.weather && weather.weather[0] && (
						<img
							src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
							alt={weather.weather[0].description}
						/>
					)}
					<p>wind {weather.wind.speed} m/s</p>
				</div>
			) : (
				<p>Loading weather data or unable to retrieve forecast...</p>
			)}
		</div>
	);
};
export default CountryDetails;

import axios from "axios"
const api_key = import.meta.env.VITE_API_KEY

const getWeather = async (capital) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

	const response = await axios.get(url)
	return response.data
}

export default { getWeather }

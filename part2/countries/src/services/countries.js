import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = async () => {
  const request = axios.get(baseUrl + 'all')
  const response = await request
  return response.data
}

const getCountry = async (name) => {
  const request = axios.get(baseUrl + 'name' + name)
  const response = await request
  return response.data
}

export default { getCountry, getAll }

import axios from "axios"

const isProduction = import.meta.env.PROD
const baseUrl = isProduction ? 'https://phonebook-backend-api.onrender.com' : '/api/persons'

const getAll = async () => {
  const request =  axios.get(baseUrl)
  const response = await request
	return response.data
}

const create = async newObject => {
  const request =  axios.post(baseUrl, newObject)
  const response = await request
	return response.data
}

const deletePerson = async id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  const response = await request
  return response.data
}

const updatePerson = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

export default { getAll, create, deletePerson, updatePerson }

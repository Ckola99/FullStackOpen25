const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
	console.log('Please provide the MongoDB Atlas password as an argument.')
	process.exit(1)
}

const password = args[2]
const name = args[3]
const number = args[4]


const url = `mongodb+srv://christopherkola_db_user:${password}@phonebookapp.qsatqsa.mongodb.net/?appName=phonebookApp`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args.length === 3) {

	console.log('phonebook:')

	Person
		.find({})
		.then(persons => {
			persons.forEach(person => {
				console.log(`${person.name} ${person.number}`)
			})
			mongoose.connection.close()
		})
		.catch(error => {
			console.error('Error fetching data:', error)
			mongoose.connection.close()
		})

} else if (args.length === 5) {

	const person = new Person({
		name: name,
		number: number,
	})

	person
		.save()
		.then(result => {
			console.log(`added ${result.name} number ${result.number} to phonebook`)
			mongoose.connection.close()
		})
		.catch(error => {
			console.error('Error saving data:', error)
			mongoose.connection.close()
		})

} else {
	console.log('Invalid number of arguments.')
	console.log('Usage: node mongo.js <password> [name] [number]')
	mongoose.connection.close()
}

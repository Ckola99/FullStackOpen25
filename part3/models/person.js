const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)


const phonebookValidator = (v) => {
	const formatRegex = /^\d{2,3}-\d+$/
	return formatRegex.test(v) && v.length >= 8
}


const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true
	},
	number: {
		type: String,
		required: true,
		validate: {
			validator: phonebookValidator,
			message: props => `${props.value} is not a valid phone number. The format must be XX-YYYYYYY or XXX-YYYYYYY and be at least 8 characters long.`
		}
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)

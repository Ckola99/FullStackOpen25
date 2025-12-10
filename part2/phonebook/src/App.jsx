import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  const addContact = (event) => {
    event.preventDefault();

    const contactObject = {
      name: newName,
      number: newNumber
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const clearFormFields = () => {
      setNewName('');
      setNewNumber('');
    }

    const handleSuccess = (updatedPerson) => {
      const updatedPersons = existingPerson
        ? persons.map(p => (p.id !== existingPerson.id ? p : updatedPerson))
        : persons.concat(updatedPerson);

      setPersons(updatedPersons);
      clearFormFields();
    };

    const handleError = (error) => {
      console.error("Error processing contact:", error);
      alert(`An error occurred while processing ${contactObject.name}.`);
    }


    if (existingPerson) {
      const confirmAdd = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmAdd) {
        personService
          .updatePerson(existingPerson.id, contactObject)
          .then(handleSuccess)
          .catch(handleError)
      }

    } else {
      personService
        .create(contactObject)
        .then(handleSuccess)
        .catch(handleError)
    }
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(error => {
          console.error("Error deleting contact:", error);
          alert(`An error occurred while deleting ${person.name}.`);
        });
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addContact={addContact} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )

}

export default App

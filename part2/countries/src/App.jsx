import React, { use } from 'react'
import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Display from './components/Display'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountryName, setSelectedCountryName] = useState(null)

  useEffect(() => {
    countriesService
      .getAll().then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const shownCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <p>find countries <input type="text" onChange={(event) => setFilter(event.target.value)} /></p>
      <Display shownCountries={shownCountries} filter={filter} selectedCountryName={selectedCountryName}
        setSelectedCountryName={setSelectedCountryName} CountryDetails={CountryDetails}/>
    </div>
  )
}

export default App

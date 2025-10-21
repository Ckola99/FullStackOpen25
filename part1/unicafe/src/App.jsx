import { useState } from 'react'

const Statistics = ({ bad, good, neutral, average, positivePercentage, total}) => {
   return (
    <table>
       <tbody>
         <StatisticLine text="good" value={good} />
         <StatisticLine text="neutral" value={neutral} />
         <StatisticLine text="bad" value={bad} />
         <StatisticLine text="all" value={total} />
         <StatisticLine text="average" value={average.toFixed(2)} />
         <StatisticLine text="positive" value={`${positivePercentage.toFixed(2)}%`} />
       </tbody>
    </table>
   )
}

const StatisticLine = ({text, value}) => {

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback = ['good', 'neutral', 'bad']

  const handleFeedback = (item) => {
    if (item === 'good'){
      setGood(prevState => prevState + 1);
    } else if (item === 'neutral') {
      setNeutral(prevState => prevState + 1);
    } else if (item === 'bad') {
      setBad(prevState => prevState + 1);
    }
  }

  let total = good + bad + neutral
  let average = (good - bad) / (total)
  let positivePercentage = (good) / (total) * 100

  return (
    <div>
      <h1>give feedback</h1>
      {feedback.map((item, index) => (
        <button onClick={() => handleFeedback(item)} key={index}>{item}</button>
      ))}
      <h1>statistics</h1>
      {total > 0 ? (<Statistics total={total} bad={bad} good={good} neutral={neutral} average={average} positivePercentage={positivePercentage} />) : (<h2>No feedback given</h2>)}
    </div>
  )
}

export default App

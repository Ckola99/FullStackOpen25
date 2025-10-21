const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = ({ part, exercise }) => {
  console.log(exercise)
  return (
    <p>{part} {exercise}</p>
  )
}

const Content = ({ parts }) => {
  console.log(parts)
  return (
    <div>
      {parts.map((part, index) => {
        return (<Part part={part.name} exercise={part.exercises} key={index} />)
      })}
    </div>
  )
}

const Total = ({ total }) => {
  const totalExercises = total?.reduce((accumulator, item) => accumulator + item.exercises, 0) || 0;

  return (
    <div>
      <p>Number of exercises: {totalExercises}</p>
    </div>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total total={course.parts} />
    </div>
  )
}

export default App

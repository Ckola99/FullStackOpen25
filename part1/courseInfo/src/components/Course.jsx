const Header = ({ courseName }) => <h1>{ courseName }</h1>

const Part = ({ part, exercise }) => <p>{part} {exercise}</p>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => {
        return (<Part part={part.name} exercise={part.exercises} key={part.id} />)
      })}
    </div>
  )
}

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((accumulator, item) => accumulator + item.exercises, 0);

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <div>
        <p><strong>total of {totalExercises} exercises</strong></p>
      </div>
    </div>
  );
}

export default Course;

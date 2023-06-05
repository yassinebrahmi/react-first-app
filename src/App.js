import { useState, useEffect } from 'react'
import Header from './components/Header'
import ManyTasks from './components/ManyTasks'
import AddTask from './components/AddTask'
function App() {

  //1 - Global
  const [tasks, setTasks] = useState([])

 useEffect(()=>{
  const getTasks = async () =>{
    const taskFromServer = await fetchTasks()
    setTasks(taskFromServer)
  }
  getTasks()
 }, []) 

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

//2 Delete
const deleteTask =  async (id) => {
  //console.log(id)
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE'
  })
  setTasks(tasks.filter((task) => task.id !== id))
}
//3 Update
const toggleReminder = async (id) => {
  //console.log(id)
  const taskToToggle = await fetchTask(id)
  const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })
  const data = await res.json()
  //console.log(data)
  setTasks(tasks.map((task)=> task.id === id ? {...task, reminder:data.reminder} : task))
}
//4 Insert
const addTask = async (task) => {
  //console.log(task)
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  //const id = Math.floor(Math.random() * 1000)
  //const newTask = {id, ...task}
  const newTask = await res.json()
  //console.log(newTask)
  setTasks([...tasks, newTask])
} 

//5 toggle form
const [showAddTask, setShowAddTask] = useState(false)
    
  return (
    <div className='container'>
      <Header showAdd={showAddTask} onAdd={() => setShowAddTask(!showAddTask)}/>

      { showAddTask &&
        <AddTask onAdd={addTask}/>
      }
      {tasks.length > 0 ? (
        <ManyTasks tasks={tasks} onDeleteMany={deleteTask} onToggleMany={toggleReminder}/>
      ):(
        'No tasks'
      )}
    </div>
  );
}

export default App;

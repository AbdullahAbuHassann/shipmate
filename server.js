const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let todos = []
let nextId = 1

function getAllTodos() {
  return todos
}

function addTodo(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Text is required')
  }
  const todo = { id: nextId++, text: text.trim(), done: false }
  todos.push(todo)
  return todo
}

function updateTodo(id, updates) {
  const todo = todos.find(t => t.id === id)
  if (!todo) return null
  if (typeof updates.text === 'string') {
    todo.text = updates.text.trim()
  }
  if (typeof updates.done === 'boolean') {
    todo.done = updates.done
  }
  return todo
}

function clearCompleted() {
  todos = todos.filter(t => !t.done)
  return todos
}

function resetTodos() {
  todos = []
  nextId = 1
}

app.get('/api/todos', (req, res) => {
  res.json(getAllTodos())
})

app.post('/api/todos', (req, res) => {
  try {
    const todo = addTodo(req.body.text)
    res.status(201).json(todo)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const todo = updateTodo(id, req.body)
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.json(todo)
})

app.delete('/api/todos/completed', (req, res) => {
  res.json(clearCompleted())
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

app.resetTodos = resetTodos
app.addTodo = addTodo
app.getAllTodos = getAllTodos
app.updateTodo = updateTodo
app.clearCompleted = clearCompleted

module.exports = app

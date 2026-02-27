const todoInput = document.getElementById('todoInput')
const addBtn = document.getElementById('addBtn')
const errorMsg = document.getElementById('errorMsg')
const todoList = document.getElementById('todoList')
const clearBtn = document.getElementById('clearBtn')

async function fetchTodos() {
  const res = await fetch('/api/todos')
  const todos = await res.json()
  renderTodos(todos)
}

function renderTodos(todos) {
  todoList.innerHTML = ''
  todos.forEach(todo => {
    const li = document.createElement('li')
    if (todo.done) li.classList.add('done')

    const span = document.createElement('span')
    span.className = 'todo-text'
    span.textContent = todo.text
    span.addEventListener('click', () => toggleTodo(todo.id, todo.done))

    const editBtn = document.createElement('button')
    editBtn.className = 'edit-btn'
    editBtn.textContent = 'Edit'
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      startEdit(li, todo.id, todo.text)
    })

    li.appendChild(span)
    li.appendChild(editBtn)
    todoList.appendChild(li)
  })

  const hasDone = todos.some(t => t.done)
  clearBtn.style.display = hasDone ? 'block' : 'none'
}

async function addTodo() {
  const text = todoInput.value
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  const data = await res.json()
  if (!res.ok) {
    errorMsg.textContent = data.error
    return
  }
  errorMsg.textContent = ''
  todoInput.value = ''
  fetchTodos()
}

async function toggleTodo(id, currentDone) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !currentDone })
  })
  fetchTodos()
}

function startEdit(li, id, currentText) {
  li.innerHTML = ''

  const input = document.createElement('input')
  input.className = 'edit-input'
  input.type = 'text'
  input.value = currentText

  const save = async () => {
    const newText = input.value
    if (!newText.trim()) {
      fetchTodos()
      return
    }
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    })
    fetchTodos()
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') fetchTodos()
  })
  input.addEventListener('blur', save)

  li.appendChild(input)
  input.focus()
}

async function clearCompleted() {
  await fetch('/api/todos/completed', { method: 'DELETE' })
  fetchTodos()
}

addBtn.addEventListener('click', addTodo)
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo()
})
clearBtn.addEventListener('click', clearCompleted)

fetchTodos()

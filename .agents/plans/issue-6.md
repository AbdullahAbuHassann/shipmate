# Feature: Kanban Board for Todo List

The following plan should be complete, but validate codebase patterns and task sanity before starting implementation.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Convert the existing flat todo list into a three-column Kanban board with **To Do**, **Doing**, and **Done** columns. Users drag cards between columns to update their status. Cards can still be edited (text) and deleted. A "Clear Done" button removes all Done cards at once.

## User Story

As a user
I want to see my tasks in a Kanban board with To Do, Doing, and Done columns
So that I can visually track the progress of each task and move them between stages by dragging

## Problem Statement

The current flat list provides only binary done/not-done state. Users need to track in-progress work separately.

## Solution Statement

Replace the `done: boolean` field with a `status: 'todo' | 'doing' | 'done'` field. Rebuild the frontend as a three-column Kanban board using HTML5 drag-and-drop. Add a single-card delete endpoint.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: `server.js`, `public/index.html`, `public/app.js`, `public/style.css`, `tests/todos.test.js`
**Dependencies**: None — native HTML5 DnD, no new npm packages

---

## CONTEXT REFERENCES

### Relevant Codebase Files — READ THESE BEFORE IMPLEMENTING

- `server.js` (lines 1–86) — full file; replace `done` with `status`, add `deleteTodo`
- `public/index.html` (lines 1–25) — full file; replace list markup with board columns
- `public/app.js` (lines 1–111) — full file; replace list rendering with board rendering + DnD
- `public/style.css` (lines 1–157) — full file; extend with board/column/card styles
- `tests/todos.test.js` (lines 1–141) — full file; update `done` → `status` throughout

### New Files to Create

None — all changes are to existing files.

### Patterns to Follow

**Data shape** (current):
```js
{ id: Number, text: String, done: Boolean }
```

**Data shape** (target):
```js
{ id: Number, text: String, status: 'todo' | 'doing' | 'done' }
```

**Business logic extraction** (`server.js` lines 13–41):
Every mutation lives in a named pure function (`addTodo`, `updateTodo`, etc.) and is exported for testing. Continue this pattern — add `deleteTodo(id)`.

**Route pattern** (`server.js` lines 48–72):
Route handlers are thin: they parse, call a function, and return JSON with the right status code.

**Frontend fetch pattern** (`public/app.js` lines 41–65):
Async functions call fetch, check `res.ok`, update `errorMsg`, then call `fetchTodos()` to re-render.

**Inline edit pattern** (`public/app.js` lines 67–97):
`startEdit(card, id, currentText)` replaces card contents with an `<input>`, saves on blur/Enter, cancels on Escape.

**Test pattern** (`tests/todos.test.js`):
```js
const request = require('supertest')
const app = require('../server')

beforeEach(() => { app.resetTodos() })

test('...', async () => {
  const res = await request(app).post('/api/todos').send({ text: 'Task' })
  expect(res.status).toBe(201)
  expect(res.body.status).toBe('todo')
})
```

**Code style**: single quotes, no semicolons, 2-space indent, camelCase functions.

---

## IMPLEMENTATION PLAN

### Phase 1: Backend — data model + new endpoint

Update `server.js` to use `status` and add `deleteTodo`.

### Phase 2: Frontend HTML

Replace the list markup with the three-column board structure.

### Phase 3: Frontend JS

Replace list rendering with board rendering + HTML5 drag-and-drop.

### Phase 4: Frontend CSS

Replace list styles with board/column/card styles.

### Phase 5: Tests

Update all tests to use `status`, add tests for new endpoint and status updates.

---

## STEP-BY-STEP TASKS

### Task 1: UPDATE `server.js` — replace `done` with `status`, add `deleteTodo`

**IMPLEMENT**:

Replace the entire file with the following logic (preserve all existing exports):

```js
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
  const todo = { id: nextId++, text: text.trim(), status: 'todo' }
  todos.push(todo)
  return todo
}

function updateTodo(id, updates) {
  const todo = todos.find(t => t.id === id)
  if (!todo) return null
  if (typeof updates.text === 'string') {
    todo.text = updates.text.trim()
  }
  if (['todo', 'doing', 'done'].includes(updates.status)) {
    todo.status = updates.status
  }
  return todo
}

function deleteTodo(id) {
  const idx = todos.findIndex(t => t.id === id)
  if (idx === -1) return null
  const [removed] = todos.splice(idx, 1)
  return removed
}

function clearDone() {
  todos = todos.filter(t => t.status !== 'done')
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
  res.json(clearDone())
})

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const removed = deleteTodo(id)
  if (!removed) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.json(removed)
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
app.deleteTodo = deleteTodo
app.clearDone = clearDone

module.exports = app
```

**GOTCHA**: The `/api/todos/completed` DELETE route must be registered **before** `/api/todos/:id` DELETE or Express will match `:id = 'completed'`.

**VALIDATE**: `npm test` — existing tests will fail (still use `done`); that's expected until Task 5.

---

### Task 2: UPDATE `public/index.html` — replace list with Kanban board

**IMPLEMENT**: Replace the `<ul>` and `<button id="clearBtn">` with a `.board` div containing three `.column` divs. Keep the input group and error paragraph.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipmate — Kanban</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Shipmate</h1>
    <div class="input-group">
      <input type="text" id="todoInput" placeholder="Add a task..." autocomplete="off">
      <button id="addBtn">Add</button>
    </div>
    <p id="errorMsg" class="error"></p>
    <div class="board">
      <div class="column" id="col-todo" data-status="todo">
        <h2 class="column-header">To Do</h2>
        <div class="cards"></div>
      </div>
      <div class="column" id="col-doing" data-status="doing">
        <h2 class="column-header">Doing</h2>
        <div class="cards"></div>
      </div>
      <div class="column" id="col-done" data-status="done">
        <h2 class="column-header">Done</h2>
        <div class="cards"></div>
        <button id="clearDoneBtn" class="clear-btn" style="display:none">Clear Done</button>
      </div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

**VALIDATE**: Open browser, page should show three empty columns (no JS errors).

---

### Task 3: UPDATE `public/app.js` — Kanban rendering + drag-and-drop

**IMPLEMENT**: Complete replacement. Key responsibilities:
- `fetchTodos()` → `renderBoard(todos)`
- `renderBoard` groups todos by status, renders cards into each column's `.cards` div
- Each card: text span, edit button, delete button; `draggable="true"`
- HTML5 DnD: `dragstart` sets `dataTransfer` with card id; column `dragover` prevents default; `drop` reads id and calls `moveCard(id, newStatus)`
- `moveCard(id, status)` → PUT `/api/todos/:id` with `{ status }`
- `deleteSingleTodo(id)` → DELETE `/api/todos/:id`
- `clearDone()` → DELETE `/api/todos/completed`
- `startEdit` adapted to work on card element (not `<li>`)

```js
const todoInput = document.getElementById('todoInput')
const addBtn = document.getElementById('addBtn')
const errorMsg = document.getElementById('errorMsg')
const clearDoneBtn = document.getElementById('clearDoneBtn')

async function fetchTodos() {
  const res = await fetch('/api/todos')
  const todos = await res.json()
  renderBoard(todos)
}

function renderBoard(todos) {
  const columns = { todo: 'col-todo', doing: 'col-doing', done: 'col-done' }
  Object.keys(columns).forEach(status => {
    const col = document.getElementById(columns[status])
    col.querySelector('.cards').innerHTML = ''
  })

  todos.forEach(todo => {
    const card = createCard(todo)
    const colId = columns[todo.status] || 'col-todo'
    document.getElementById(colId).querySelector('.cards').appendChild(card)
  })

  const hasDone = todos.some(t => t.status === 'done')
  clearDoneBtn.style.display = hasDone ? 'block' : 'none'
}

function createCard(todo) {
  const card = document.createElement('div')
  card.className = 'card'
  card.draggable = true
  card.dataset.id = todo.id

  const span = document.createElement('span')
  span.className = 'card-text'
  span.textContent = todo.text

  const editBtn = document.createElement('button')
  editBtn.className = 'edit-btn'
  editBtn.textContent = 'Edit'
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    startEdit(card, todo.id, todo.text)
  })

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = '×'
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    deleteSingleTodo(todo.id)
  })

  card.appendChild(span)
  card.appendChild(editBtn)
  card.appendChild(deleteBtn)

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', todo.id)
    card.classList.add('dragging')
  })
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging')
  })

  return card
}

function startEdit(card, id, currentText) {
  card.innerHTML = ''

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

  card.appendChild(input)
  input.focus()
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

async function moveCard(id, status) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  fetchTodos()
}

async function deleteSingleTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  fetchTodos()
}

async function clearDone() {
  await fetch('/api/todos/completed', { method: 'DELETE' })
  fetchTodos()
}

// Set up drag-and-drop on each column
document.querySelectorAll('.column').forEach(col => {
  col.addEventListener('dragover', (e) => {
    e.preventDefault()
    col.classList.add('drag-over')
  })
  col.addEventListener('dragleave', () => {
    col.classList.remove('drag-over')
  })
  col.addEventListener('drop', (e) => {
    e.preventDefault()
    col.classList.remove('drag-over')
    const id = parseInt(e.dataTransfer.getData('text/plain'), 10)
    const status = col.dataset.status
    moveCard(id, status)
  })
})

addBtn.addEventListener('click', addTodo)
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo()
})
clearDoneBtn.addEventListener('click', clearDone)

fetchTodos()
```

**VALIDATE**: Cards appear in columns, drag works between columns, edit and delete work.

---

### Task 4: UPDATE `public/style.css` — board layout + card styles

**IMPLEMENT**: Replace the entire stylesheet. Keep the same colour palette and font; extend with board/column/card rules.

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  background: #f9f9f9;
  color: #222;
  min-height: 100vh;
  padding: 40px 16px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #111;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  max-width: 500px;
}

#todoInput {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
}

#todoInput:focus {
  border-color: #888;
}

#addBtn {
  padding: 8px 18px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;
}

#addBtn:hover {
  background: #555;
}

.error {
  color: #c0392b;
  font-size: 0.8rem;
  min-height: 18px;
  margin-bottom: 16px;
}

/* Board */

.board {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.column {
  flex: 1;
  border-radius: 8px;
  padding: 16px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: outline 0.1s;
}

#col-todo  { background: #eef4fb; }
#col-doing { background: #fffbea; }
#col-done  { background: #eafaf1; }

.column.drag-over {
  outline: 2px dashed #888;
  outline-offset: -2px;
}

.column-header {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #555;
  margin-bottom: 4px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

/* Cards */

.card {
  background: #fff;
  border-radius: 6px;
  padding: 10px 10px 10px 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: grab;
  transition: box-shadow 0.15s, opacity 0.15s;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.card.dragging {
  opacity: 0.45;
  cursor: grabbing;
}

.card-text {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
}

.edit-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #666;
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s;
}

.edit-btn:hover {
  border-color: #999;
  color: #333;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  line-height: 1;
  color: #bbb;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0 2px;
  transition: color 0.15s;
}

.delete-btn:hover {
  color: #c0392b;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
}

/* Clear Done button */

.clear-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.82rem;
  color: #888;
  cursor: pointer;
  align-self: flex-start;
  transition: border-color 0.15s, color 0.15s;
}

.clear-btn:hover {
  border-color: #c0392b;
  color: #c0392b;
}

@media (max-width: 640px) {
  .board {
    flex-direction: column;
  }
}
```

**VALIDATE**: Three columns visible with distinct background colours; cards render correctly.

---

### Task 5: UPDATE `tests/todos.test.js` — replace `done` with `status`, add new tests

**IMPLEMENT**: Replace the entire test file:

```js
const request = require('supertest')
const app = require('../server')

beforeEach(() => {
  app.resetTodos()
})

describe('GET /api/todos', () => {
  test('returns empty array initially', async () => {
    const res = await request(app).get('/api/todos')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  test('returns all todos after adding some', async () => {
    await request(app).post('/api/todos').send({ text: 'Task one' })
    await request(app).post('/api/todos').send({ text: 'Task two' })
    const res = await request(app).get('/api/todos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('POST /api/todos', () => {
  test('adds a todo with valid text and returns 201', async () => {
    const res = await request(app).post('/api/todos').send({ text: 'Buy groceries' })
    expect(res.status).toBe(201)
    expect(res.body.text).toBe('Buy groceries')
    expect(res.body.status).toBe('todo')
    expect(res.body.id).toBeDefined()
  })

  test('returns 400 when text is empty string', async () => {
    const res = await request(app).post('/api/todos').send({ text: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('returns 400 when text is missing', async () => {
    const res = await request(app).post('/api/todos').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('returns 400 when text is only whitespace', async () => {
    const res = await request(app).post('/api/todos').send({ text: '   ' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})

describe('PUT /api/todos/:id', () => {
  test('updates status to doing', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Task' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ status: 'doing' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('doing')
  })

  test('updates status to done', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Task' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ status: 'done' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('done')
  })

  test('updates text', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Old text' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ text: 'New text' })
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('New text')
  })

  test('updates both text and status simultaneously', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Original' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ text: 'Updated', status: 'doing' })
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('Updated')
    expect(res.body.status).toBe('doing')
  })

  test('ignores invalid status values', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Task' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ status: 'invalid' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('todo')
  })

  test('returns 404 for non-existent id', async () => {
    const res = await request(app).put('/api/todos/9999').send({ status: 'doing' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })
})

describe('DELETE /api/todos/:id', () => {
  test('deletes a todo by id', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Delete me' })
    const id = created.body.id
    const res = await request(app).delete(`/api/todos/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
    const all = await request(app).get('/api/todos')
    expect(all.body).toHaveLength(0)
  })

  test('returns 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/todos/9999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })
})

describe('DELETE /api/todos/completed', () => {
  test('removes only done-status todos', async () => {
    await request(app).post('/api/todos').send({ text: 'Keep this' })
    const del = await request(app).post('/api/todos').send({ text: 'Delete this' })
    await request(app).put(`/api/todos/${del.body.id}`).send({ status: 'done' })

    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].text).toBe('Keep this')
  })

  test('returns remaining todos when none are done', async () => {
    await request(app).post('/api/todos').send({ text: 'Active task' })
    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

  test('works when no todos exist (no-op)', async () => {
    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(0)
  })
})

describe('Business logic functions', () => {
  test('addTodo creates todo with status todo', () => {
    const todo = app.addTodo('Test task')
    expect(todo).toMatchObject({ text: 'Test task', status: 'todo' })
    expect(todo.id).toBeDefined()
  })

  test('updateTodo modifies status and text', () => {
    const todo = app.addTodo('Original')
    const updated = app.updateTodo(todo.id, { text: 'Changed', status: 'doing' })
    expect(updated.text).toBe('Changed')
    expect(updated.status).toBe('doing')
  })

  test('deleteTodo removes the todo', () => {
    const todo = app.addTodo('Remove me')
    const removed = app.deleteTodo(todo.id)
    expect(removed.id).toBe(todo.id)
    expect(app.getAllTodos()).toHaveLength(0)
  })

  test('deleteTodo returns null for missing id', () => {
    const result = app.deleteTodo(9999)
    expect(result).toBeNull()
  })

  test('clearDone filters correctly', () => {
    app.addTodo('Keep')
    const done = app.addTodo('Remove')
    app.updateTodo(done.id, { status: 'done' })
    const remaining = app.clearDone()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].text).toBe('Keep')
  })

  test('getAllTodos returns current state', () => {
    app.addTodo('One')
    app.addTodo('Two')
    const all = app.getAllTodos()
    expect(all).toHaveLength(2)
  })
})
```

**VALIDATE**: `npm test` — all tests pass.

---

## VALIDATION COMMANDS

### Level 1: Lint
```bash
npm run lint
```

### Level 2: Unit + Integration Tests
```bash
npm test
```

### Level 3: Manual Smoke Test
1. `npm start`
2. Open `http://localhost:3000`
3. Add a task → appears in **To Do**
4. Drag to **Doing** → persists on refresh
5. Drag to **Done** → "Clear Done" button appears
6. Click "Clear Done" → Done column empties
7. Click Edit → inline input appears, Enter saves
8. Click × → card deleted
9. Mobile viewport (640px) → columns stack vertically

---

## ACCEPTANCE CRITERIA

- [ ] Three Kanban columns visible: To Do, Doing, Done
- [ ] New tasks appear in To Do
- [ ] Cards can be dragged between columns; status persists
- [ ] Column background colours: blue-tinted, yellow-tinted, green-tinted
- [ ] Edit button triggers inline text editing
- [ ] Delete (×) button removes a single card
- [ ] "Clear Done" button removes all Done cards; hidden when Done is empty
- [ ] `npm test` passes with 0 failures
- [ ] `npm run lint` passes with 0 errors
- [ ] Responsive: columns stack on mobile

---

## COMPLETION CHECKLIST

- [ ] Task 1: `server.js` updated — `status` field, `deleteTodo`, route order correct
- [ ] Task 2: `index.html` updated — three-column board structure
- [ ] Task 3: `app.js` updated — board rendering + DnD
- [ ] Task 4: `style.css` updated — board/column/card styles
- [ ] Task 5: `tests/todos.test.js` updated — all tests pass
- [ ] `npm run lint` clean
- [ ] `npm test` passes
- [ ] Manual smoke test completed

---

## NOTES

- Route order matters: `DELETE /api/todos/completed` must be registered before `DELETE /api/todos/:id`
- Native HTML5 DnD is sufficient — no library needed
- Card order within columns is intentionally not preserved (stateless re-render keeps it simple)
- `done` field is fully removed — cleaner than maintaining both `done` and `status`
- `clearDone` is the internal function name; the API route stays at `DELETE /api/todos/completed` for consistency

**Confidence score: 9/10** — all patterns are well-established in the existing codebase; no new libraries; the only risk is route ordering for the two DELETE endpoints.

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
    expect(res.body.done).toBe(false)
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
  test('toggles done status', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Task' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ done: true })
    expect(res.status).toBe(200)
    expect(res.body.done).toBe(true)
  })

  test('updates text', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Old text' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ text: 'New text' })
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('New text')
  })

  test('returns 404 for non-existent id', async () => {
    const res = await request(app).put('/api/todos/9999').send({ done: true })
    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })

  test('handles updating both text and done simultaneously', async () => {
    const created = await request(app).post('/api/todos').send({ text: 'Original' })
    const id = created.body.id
    const res = await request(app).put(`/api/todos/${id}`).send({ text: 'Updated', done: true })
    expect(res.status).toBe(200)
    expect(res.body.text).toBe('Updated')
    expect(res.body.done).toBe(true)
  })
})

describe('DELETE /api/todos/completed', () => {
  test('removes only completed todos', async () => {
    await request(app).post('/api/todos').send({ text: 'Keep this' })
    const del = await request(app).post('/api/todos').send({ text: 'Delete this' })
    await request(app).put(`/api/todos/${del.body.id}`).send({ done: true })

    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].text).toBe('Keep this')
  })

  test('returns remaining incomplete todos', async () => {
    await request(app).post('/api/todos').send({ text: 'Active task' })
    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

  test('works when no todos are completed (no-op)', async () => {
    await request(app).post('/api/todos').send({ text: 'Not done' })
    const res = await request(app).delete('/api/todos/completed')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })
})

describe('Business logic functions', () => {
  test('addTodo creates todo with correct shape', () => {
    const todo = app.addTodo('Test task')
    expect(todo).toMatchObject({ text: 'Test task', done: false })
    expect(todo.id).toBeDefined()
  })

  test('updateTodo modifies existing todo', () => {
    const todo = app.addTodo('Original')
    const updated = app.updateTodo(todo.id, { text: 'Changed', done: true })
    expect(updated.text).toBe('Changed')
    expect(updated.done).toBe(true)
  })

  test('clearCompleted filters correctly', () => {
    app.addTodo('Keep')
    const done = app.addTodo('Remove')
    app.updateTodo(done.id, { done: true })
    const remaining = app.clearCompleted()
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

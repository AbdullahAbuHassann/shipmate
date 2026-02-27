# Feature: To-Do List App

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming conventions: camelCase for variables/functions, single quotes, no semicolons, 2-space indentation.

## Feature Description

A simple to-do list web application where users can add tasks, mark them as done (with strikethrough), edit task text, and clear all completed tasks at once. Tasks are stored in memory on the server — refreshing the page starts fresh. The UI should be clean, minimal, and white/light.

## User Story

As a user
I want to manage a simple to-do list
So that I can track tasks, mark them done, edit them, and clear completed ones

## Problem Statement

The project has no application code yet. We need to build the entire to-do list app from scratch — backend API, frontend UI, and tests.

## Solution Statement

Build a Node.js + Express backend with RESTful API endpoints for CRUD operations on todos, served alongside a vanilla HTML/CSS/JS frontend. All state lives in a plain JS array in memory. Business logic is extracted into testable functions. The UI is minimal and clean.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: Everything (greenfield)
**Dependencies**: express, jest, supertest

---

## CONTEXT REFERENCES

### Relevant Codebase Files — IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `.claude/CLAUDE.md` — Project conventions, tech stack, code style, testing patterns, architecture rules
- `CLAUDE.md` — GitHub issue handling protocol (not needed for implementation, but good context)

### New Files to Create

- `package.json` — Project manifest with dependencies and scripts
- `server.js` — Express entry point: serves static files + API routes, in-memory state, extracted business logic
- `public/index.html` — Frontend HTML structure
- `public/style.css` — Minimal CSS styling
- `public/app.js` — Frontend JavaScript (fetch API calls, DOM manipulation)
- `tests/todos.test.js` — Jest unit tests for API routes and business logic
- `.eslintrc.json` — ESLint configuration matching code style conventions

### Patterns to Follow

**Naming Conventions:**
- `camelCase` for variables and functions
- `PascalCase` for classes
- Single quotes for strings
- No semicolons
- 2-space indentation

**Architecture:**
- All API routes under `/api/*`
- In-memory state as a plain JS array at top of `server.js`
- Never query state directly in route handlers — extract logic into testable functions
- Keep `server.js` under 200 lines
- Frontend fetches from `/api/*` — no page reloads
- Static files served from `public/`

**Error Handling:**
- API errors return `{ error: 'message' }` with appropriate HTTP status
- Frontend shows errors inline, never as alerts

**Testing Pattern:**
```js
const request = require('supertest')
const app = require('../server')

test('POST /api/todos adds a todo', async () => {
  const res = await request(app)
    .post('/api/todos')
    .send({ text: 'Buy groceries' })
  expect(res.status).toBe(201)
  expect(res.body.text).toBe('Buy groceries')
})
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation — Project Setup

Set up the Node.js project with package.json, dependencies, and ESLint configuration.

**Tasks:**
- Create `package.json` with express, jest, supertest, eslint
- Create `.eslintrc.json` matching code style conventions

### Phase 2: Core Implementation — Backend API

Build the Express server with in-memory todo storage and RESTful API endpoints. Extract all business logic into pure functions.

**Tasks:**
- Create `server.js` with extracted business logic functions and API routes
- API endpoints:
  - `GET /api/todos` — list all todos
  - `POST /api/todos` — add a new todo (validate non-empty text)
  - `PUT /api/todos/:id` — update a todo (toggle done, edit text)
  - `DELETE /api/todos/completed` — delete all completed todos

### Phase 3: Core Implementation — Frontend

Build the vanilla HTML/CSS/JS frontend.

**Tasks:**
- Create `public/index.html` with input field, add button, todo list container, clear completed button
- Create `public/style.css` with minimal, clean styling
- Create `public/app.js` with fetch-based API calls and DOM manipulation

### Phase 4: Testing & Validation

Write comprehensive Jest tests for all API endpoints and business logic.

**Tasks:**
- Create `tests/todos.test.js` covering all endpoints and edge cases

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### 1. CREATE `package.json`

- **IMPLEMENT**: Project manifest with all dependencies and scripts
- **DETAILS**:
  - `name`: `shipmate`
  - `version`: `1.0.0`
  - `main`: `server.js`
  - `scripts`:
    - `start`: `node server.js`
    - `test`: `jest --forceExit --detectOpenHandles`
    - `lint`: `eslint .`
  - `dependencies`: `express` (latest)
  - `devDependencies`: `jest`, `supertest`, `eslint`
- **VALIDATE**: `cat package.json` (verify structure)

### 2. CREATE `.eslintrc.json`

- **IMPLEMENT**: ESLint config matching project conventions
- **DETAILS**:
  - `env`: `{ "node": true, "browser": true, "jest": true, "es2021": true }`
  - Rules: no semicolons, single quotes, 2-space indent
- **VALIDATE**: `cat .eslintrc.json`

### 3. INSTALL dependencies

- **IMPLEMENT**: Run `npm install` to install all dependencies
- **VALIDATE**: `ls node_modules/.package-lock.json` or `npm ls --depth=0`

### 4. CREATE `server.js`

- **IMPLEMENT**: Express server with in-memory todo storage and API routes
- **DETAILS**:

  **In-memory state** (top of file):
  ```js
  let todos = []
  let nextId = 1
  ```

  **Extracted business logic functions** (testable, not in route handlers):
  ```js
  function getAllTodos() { ... }
  function addTodo(text) { ... }       // returns new todo or throws if empty
  function updateTodo(id, updates) { ... }  // toggle done, edit text
  function clearCompleted() { ... }    // removes all done todos
  function resetTodos() { ... }        // for test isolation
  ```

  **Todo object shape**:
  ```js
  { id: number, text: string, done: boolean }
  ```

  **API routes**:
  - `GET /api/todos` — calls `getAllTodos()`, returns 200 with array
  - `POST /api/todos` — validates text is non-empty string, calls `addTodo(text)`, returns 201 with new todo. Returns 400 with `{ error: 'Text is required' }` if empty.
  - `PUT /api/todos/:id` — calls `updateTodo(id, updates)`, returns 200 with updated todo. Returns 404 with `{ error: 'Todo not found' }` if not found. Accepts `{ text, done }` in body (both optional).
  - `DELETE /api/todos/completed` — calls `clearCompleted()`, returns 200 with remaining todos

  **Static file serving**: `express.static('public')`

  **Server startup**: Listen on `process.env.PORT || 3000`, but only when not in test mode. Export `app` for supertest.

  ```js
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

  module.exports = app
  ```

  Also export the business logic functions for direct testing:
  ```js
  module.exports = app
  module.exports.resetTodos = resetTodos
  module.exports.addTodo = addTodo
  module.exports.getAllTodos = getAllTodos
  module.exports.updateTodo = updateTodo
  module.exports.clearCompleted = clearCompleted
  ```

  Alternatively, attach them to app: `app.resetTodos = resetTodos` etc. — pick whichever keeps the file cleaner.

- **GOTCHA**: Keep under 200 lines. Extract logic into functions, keep routes slim.
- **GOTCHA**: `DELETE /api/todos/completed` route must be defined BEFORE any `DELETE /api/todos/:id` route (if one existed), otherwise Express would try to match "completed" as an `:id` parameter.
- **VALIDATE**: `node -c server.js` (syntax check)

### 5. CREATE `public/index.html`

- **IMPLEMENT**: HTML structure for the to-do list app
- **DETAILS**:
  - `<!DOCTYPE html>` with proper meta tags (charset, viewport)
  - Title: "To-Do List"
  - Link to `style.css`
  - Main container centered on page:
    - `<h1>` — "To-Do List"
    - Input group: `<input type="text" id="todoInput" placeholder="Add a task...">` + `<button id="addBtn">Add</button>`
    - Error message: `<p id="errorMsg" class="error"></p>` (hidden by default)
    - Todo list: `<ul id="todoList"></ul>`
    - Clear button: `<button id="clearBtn">Clear completed</button>` (hidden when no completed todos)
  - Script tag: `<script src="app.js"></script>`
- **VALIDATE**: Open in browser or check HTML syntax

### 6. CREATE `public/style.css`

- **IMPLEMENT**: Minimal, clean CSS styling
- **DETAILS**:
  - Body: white background, system font stack, centered layout
  - Container: max-width ~500px, centered with margin auto, padding
  - H1: simple, dark text
  - Input group: input takes most width, button beside it
  - Input: border, rounded corners, padding
  - Add button: simple background color (e.g., light blue or dark), white text, rounded
  - Todo list (`ul`): no list style, no padding
  - Todo items (`li`): padding, border-bottom, display flex, align items center, cursor pointer
  - Done class (`.done`): text-decoration line-through, muted text color
  - Edit input: inline text input for editing mode
  - Error message: red text, small font, hidden by default
  - Clear button: muted style, only visible when there are completed todos
  - Responsive: works on mobile widths
- **VALIDATE**: Visual inspection

### 7. CREATE `public/app.js`

- **IMPLEMENT**: Frontend JavaScript for DOM interaction and API calls
- **DETAILS**:

  **State management:**
  - Fetch todos from API on page load
  - Re-render list after every action

  **Functions:**
  - `fetchTodos()` — GET /api/todos, then render
  - `renderTodos(todos)` — clear list, create `<li>` for each todo
  - `addTodo()` — read input value, POST /api/todos, handle validation error
  - `toggleTodo(id, currentDone)` — PUT /api/todos/:id with `{ done: !currentDone }`
  - `startEdit(id, currentText)` — replace todo text with input field
  - `saveEdit(id, newText)` — PUT /api/todos/:id with `{ text: newText }`
  - `clearCompleted()` — DELETE /api/todos/completed

  **Todo list item rendering:**
  Each `<li>` contains:
  - Todo text (click to toggle done)
  - An "Edit" button (small, unobtrusive) — click enters edit mode
  - Apply `.done` class when `todo.done` is true

  **Edit mode:**
  - Replace text span with an input field pre-filled with current text
  - Save on Enter key or blur (click away)
  - Cancel on Escape key

  **Error handling:**
  - Show inline error under input when adding empty task
  - Clear error on next successful add
  - Show errors from API responses inline

  **Clear completed button:**
  - Show/hide based on whether any todos are done
  - On click, call `clearCompleted()`

  **Event listeners:**
  - Add button click → `addTodo()`
  - Enter key in input → `addTodo()`
  - Clear completed button click → `clearCompleted()`
  - Todo item click → `toggleTodo()`
  - Edit button click → `startEdit()`

- **VALIDATE**: Manual browser testing

### 8. CREATE `tests/todos.test.js`

- **IMPLEMENT**: Comprehensive Jest tests using supertest
- **DETAILS**:

  **Setup:**
  ```js
  const request = require('supertest')
  const app = require('../server')

  beforeEach(() => {
    app.resetTodos()
  })
  ```

  **Test cases:**

  *GET /api/todos*
  - Returns empty array initially
  - Returns all todos after adding some

  *POST /api/todos*
  - Adds a todo with valid text, returns 201
  - Returns the created todo with id, text, done=false
  - Returns 400 when text is empty string
  - Returns 400 when text is missing
  - Returns 400 when text is only whitespace

  *PUT /api/todos/:id*
  - Toggles done status
  - Updates text
  - Returns 404 for non-existent id
  - Handles updating both text and done simultaneously

  *DELETE /api/todos/completed*
  - Removes only completed todos
  - Returns remaining (incomplete) todos
  - Works when no todos are completed (no-op)

  *Business logic functions (direct testing)*
  - `addTodo()` — creates todo with correct shape
  - `updateTodo()` — modifies existing todo
  - `clearCompleted()` — filters correctly
  - `getAllTodos()` — returns current state

- **VALIDATE**: `npm test`

### 9. LINT and FIX

- **IMPLEMENT**: Run ESLint and fix any issues
- **VALIDATE**: `npm run lint`

---

## TESTING STRATEGY

### Unit Tests

Using Jest + supertest following the project's established pattern:
- Test each API endpoint with valid and invalid inputs
- Test business logic functions directly
- Use `beforeEach` with `resetTodos()` for test isolation
- Target: all endpoints covered, all edge cases for validation

### Edge Cases

- Adding todo with empty string → 400 error
- Adding todo with whitespace-only string → 400 error
- Updating non-existent todo → 404 error
- Clearing completed when none are completed → returns all todos unchanged
- Toggling done back and forth
- Editing a completed todo's text

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npm run lint
```

### Level 2: Unit Tests

```bash
npm test
```

### Level 3: Manual Validation

```bash
# Start server and test manually
npm start
# In another terminal:
curl http://localhost:3000/api/todos
curl -X POST http://localhost:3000/api/todos -H 'Content-Type: application/json' -d '{"text":"Test task"}'
curl http://localhost:3000/api/todos
curl -X PUT http://localhost:3000/api/todos/1 -H 'Content-Type: application/json' -d '{"done":true}'
curl -X DELETE http://localhost:3000/api/todos/completed
```

---

## ACCEPTANCE CRITERIA

- [ ] `npm install` succeeds with no errors
- [ ] `npm test` passes all tests with zero failures
- [ ] `npm run lint` passes with zero errors
- [ ] User can type a task and press Add to add it to the list
- [ ] Pressing Add with empty input shows inline error message
- [ ] Clicking a task toggles strikethrough (done/undone)
- [ ] User can edit a task's text
- [ ] "Clear completed" button removes all done tasks
- [ ] UI is minimal, clean, white/light design
- [ ] server.js is under 200 lines
- [ ] Business logic is extracted into testable functions
- [ ] All API routes return proper error objects with status codes
- [ ] No page reloads — all interactions via fetch

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes
- [ ] No linting errors
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

- **No database**: All state is a plain JS array. The `resetTodos()` function is essential for test isolation.
- **Module exports**: `server.js` exports the Express app for supertest AND the business logic functions for direct testing. Using `module.exports = app` then assigning properties like `app.resetTodos = resetTodos` is the cleanest approach.
- **Edit UX**: Edit mode replaces the text with an input field inline. Save on Enter/blur, cancel on Escape. This keeps the UI simple without modals.
- **Clear completed visibility**: The "Clear completed" button should only be visible/enabled when there's at least one completed todo. This prevents confusion.
- **Route ordering**: `DELETE /api/todos/completed` must be defined before any parameterized DELETE route to avoid Express treating "completed" as an ID.
- **Test isolation**: Every test resets the in-memory store via `beforeEach(() => app.resetTodos())` to prevent test interdependence.

# Project Conventions

## Tech Stack

- Single HTML/CSS/JS frontend (no framework, served by Express)
- Node.js + Express backend (`server.js`)
- Jest for unit tests
- No database — in-memory storage only

## Project Structure

```
shipmate/
├── server.js          # Express entry point — serves static files + API routes
├── public/
│   ├── index.html     # Frontend
│   ├── style.css
│   └── app.js         # Frontend JS
├── tests/
│   └── *.test.js      # Jest unit tests
└── package.json
```

## Commands

```bash
npm install       # install dependencies
npm start         # start Express on port 3000
npm test          # run Jest unit tests
npm run lint      # run ESLint
```

## Architecture Patterns

- All API routes live in `server.js` under `/api/*`
- In-memory state is a plain JS array/object at the top of `server.js`
- Frontend fetches from `/api/*` — no page reloads
- Static files served from `public/`

## Code Style

- `camelCase` for variables and functions
- `PascalCase` for classes
- Single quotes for strings
- No semicolons
- 2-space indentation

## Testing Standards

- Test framework: Jest
- Test files live in `tests/`, named `*.test.js`
- Unit test the API route logic and any pure functions
- Each test file covers one module or route group

### Test pattern

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

## Error Handling

- API errors return `{ error: "message" }` with appropriate HTTP status
- Frontend shows errors inline, never as alerts

## Git Workflow

### Branch Strategy

```
main (protected) <-- PR <-- feature/your-feature
```

### Commit Messages

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Never include "claude code" or "written by claude" in commit messages.

## Important Rules

- No feature is complete without at least one Jest unit test
- Never query state directly from a route handler — extract logic into a function that can be tested
- Keep `server.js` under 200 lines — split into separate route files if needed

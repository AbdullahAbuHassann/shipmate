# Project Conventions

> [TODO: Replace this entire file with your project's conventions. The sections below are a template — fill in each one for your stack. The more specific you are here, the better Claude will follow your patterns.]

## Tech Stack

> [TODO: List your actual stack here]

- **Backend**: e.g. Python 3.12+, FastAPI, SQLAlchemy — or Node.js, Express, Prisma
- **Frontend**: e.g. React 18, Vite, Tailwind CSS — or Vue, Next.js, etc.
- **Database**: e.g. PostgreSQL 16, Redis — or MySQL, MongoDB, etc.
- **Auth**: e.g. Clerk, Auth0, NextAuth — or your own JWT implementation
- **Infrastructure**: e.g. Railway, Vercel, AWS — include local dev setup
- **Testing**: e.g. pytest + pytest-asyncio, Jest + Testing Library, Vitest

## Project Structure

> [TODO: Describe your directory layout. A tree diagram is ideal.]

```
your-project/
├── backend/
│   └── src/
├── frontend/
│   └── src/
└── ...
```

## Commands

> [TODO: Replace with your actual commands]

```bash
# Install dependencies
# [YOUR_INSTALL_COMMAND]   e.g. npm install, uv sync, bundle install

# Run dev server
# [YOUR_DEV_COMMAND]       e.g. npm run dev, uvicorn main:app --reload

# Run tests
# [YOUR_TEST_COMMAND]      e.g. npm test, pytest -m unit, go test ./...

# Lint / format
# [YOUR_LINT_COMMAND]      e.g. npm run lint, ruff check ., golangci-lint run

# Database migrations
# [YOUR_MIGRATION_COMMAND] e.g. npm run migrate, alembic upgrade head
```

## Architecture Patterns

> [TODO: Describe patterns Claude must follow in your codebase]

- e.g. Vertical slice architecture — each feature owns its own models, services, routes, and tests
- e.g. Repository pattern for data access — never query the database directly in a service
- e.g. All API responses use a standard envelope: `{ data, error, meta }`

## Code Style

> [TODO: Describe your style rules]

### Naming Conventions

- Variables/functions: e.g. `snake_case` (Python) or `camelCase` (JS/TS)
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: e.g. `kebab-case.ts` or `snake_case.py`

### File and Function Limits

- Files: Max 500 lines — split into modules if approaching this
- Functions: Max 50 lines — single clear responsibility
- Line length: e.g. 100 characters

### Python (if applicable)

- PEP 8 with your chosen line length (ruff-enforced)
- Type hints on all function signatures
- Google-style docstrings on all public functions
- Pydantic v2 for data validation

### TypeScript (if applicable)

- Strict mode enabled
- No `any` types — use `unknown` and narrow
- Prefer `interface` over `type` for object shapes
- Named exports over default exports

## Testing Standards

> [TODO: Describe your testing approach]

### Test Pyramid

- 70% Unit tests: pure functions, business logic, validators
- 20% Integration tests: API endpoints, database interactions
- 10% E2E tests: critical user journeys

### Test Patterns

> [TODO: Show examples of your test patterns — fixture setup, mocking, assertions]

```python
# Example: pytest async test pattern
@pytest.mark.asyncio
async def test_create_item(db_session, mock_service):
    result = await service.create(db_session, CreateItemRequest(...))
    assert result.id is not None
```

## Database Conventions (if applicable)

> [TODO: Describe your database naming and query patterns]

```sql
-- Primary keys: {entity}_id
-- Foreign keys: {referenced_entity}_id
-- Timestamps: {action}_at (always TIMESTAMPTZ)
-- Booleans: is_{state}
```

## Error Handling

> [TODO: Describe how errors are handled in your codebase]

- Custom exception hierarchy or standard HTTP errors?
- Error response format: e.g. `{ error: "not_found", message: "..." }`
- Where errors are caught: middleware, service layer, or route handlers?

## Logging

> [TODO: Describe your logging setup]

- Library: e.g. structlog, winston, zap
- Level conventions: INFO for normal ops, WARNING for recoverable errors, ERROR for failures
- Always include request ID and user ID in log context

## Configuration

> [TODO: Describe how config/secrets are managed]

- Environment variables via `.env` (never commit secrets)
- Config validation at startup (Pydantic Settings, Zod, etc.)

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

> [TODO: Add any project-specific rules Claude must always follow]

- Never assume or guess — when in doubt, ask for clarification
- Always verify file paths and module names before use
- No feature is complete without tests
- [YOUR_RULE_3]
- [YOUR_RULE_4]

# Spec: Todo Feature

## What it does

Users can manage a personal list of tasks. Tasks can be added, marked as complete, edited, and removed in bulk.

## Behaviour

### Adding a task
- User types text into the input field and presses Enter or clicks Add
- A new task appears at the bottom of the list, marked as incomplete
- The input field clears after adding
- Empty or whitespace-only input is rejected with an inline error message
- Input is trimmed of leading/trailing whitespace before saving

### Completing a task
- Clicking on the task text toggles its done state
- Completed tasks are visually distinguished (strikethrough text, muted colour)
- Completed tasks stay in their position in the list — they are not moved

### Editing a task
- An Edit button appears on each task
- Clicking Edit replaces the task text with an inline text input pre-filled with the current text
- Pressing Enter or blurring the input saves the change
- Pressing Escape cancels the edit and restores the original text
- Saving an empty or whitespace-only edit cancels the edit instead of saving

### Clearing completed tasks
- A "Clear completed" button appears when at least one task is marked done
- Clicking it removes all completed tasks permanently
- The button disappears when no tasks are completed

### Persistence
- Tasks are stored in-memory on the server (no database)
- Tasks do not persist across server restarts — this is intentional for the demo app

## What it does NOT do

- No task categories or tags
- No due dates or reminders
- No task ordering or drag-and-drop reordering
- No user accounts or per-user lists
- No task search or filtering (unless added as a specced enhancement)
- No subtasks

## Acceptance criteria

- [ ] Adding a task with valid text creates it and shows it in the list
- [ ] Adding a task with empty or whitespace-only text shows an error, no task created
- [ ] Clicking a task text toggles its done state
- [ ] Editing a task saves the new text on Enter or blur
- [ ] Editing a task cancels on Escape
- [ ] Clear completed removes all done tasks and hides the button
- [ ] All behaviour works via the REST API (`GET`, `POST /api/todos`, `PUT /api/todos/:id`, `DELETE /api/todos/completed`)

## API contract

```
GET    /api/todos              returns all todos
POST   /api/todos              { text: string } → 201 { id, text, done }
PUT    /api/todos/:id          { text?, done? } → 200 updated todo
DELETE /api/todos/completed    → 200 remaining todos
```

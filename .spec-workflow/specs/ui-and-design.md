# Spec: UI and Design

## What it covers

All visual and interaction decisions for the app: layout, colours, typography, spacing, and component behaviour. Changes to any of these — button labels, colours, fonts, sizing, error messages, placeholder text — are enhancements within this spec.

## Layout

- Single centred card on a light grey background
- Card is white, max-width 500px, with subtle box shadow and 8px border radius
- 40px vertical padding on the page, 16px horizontal padding on mobile
- Card padding: 32px top/bottom, 28px left/right (24px/16px on mobile)

## Typography

- Font: Inter (loaded from Google Fonts), fallback to system sans-serif
- Heading: 1.5rem, weight 600, near-black (#111)
- Body/input text: 0.95rem
- Error messages: 0.8rem, red (#c0392b)
- Muted/completed text: #aaa

## Colours

- Page background: #f9f9f9
- Card background: #fff
- Primary text: #222
- Heading: #111
- Muted text: #aaa
- Border (inputs, buttons): #ddd, focused/active: #888 or #999
- Primary action button (Add): background #333, hover #555, text white
- Destructive hover (Clear completed): border and text #c0392b
- Error text: #c0392b

## Components

### Input field
- Full width within its row, 8px/12px padding, 6px border radius
- Border #ddd, focus border #888, no outline ring
- Smooth border colour transition (0.15s)

### Add button
- Fixed width, sits to the right of the input
- Dark background (#333), white text, 6px border radius
- Hover lightens to #555

### Task list item
- Full width, flex row, items centred, 8px gap
- 10px vertical padding, bottom border #f0f0f0 (none on last item)
- Completed tasks: strikethrough text, colour #aaa

### Edit button
- Ghost button (no background), border #ddd, 4px border radius
- Small text (0.78rem), colour #666
- Hover: border #999, text #333

### Edit input
- Replaces the task text span inline
- Full width, 4px/8px padding, border #888, 4px border radius

### Clear completed button
- Ghost button, border #ddd, 6px border radius
- Small text (0.85rem), colour #888
- Hover: border and text #c0392b
- Only visible when at least one task is done

## Error handling

- Errors display as inline text below the input field, never as alerts or modals
- Error clears as soon as the user successfully adds a task

## Interaction principles

- No page reloads for any action — all updates happen in place
- No loading spinners for typical interactions (in-memory, fast)
- Keyboard support: Enter submits the add form, Enter saves an edit, Escape cancels an edit

## What this spec does NOT cover

- Application logic (see `todo-feature.md`)
- Any animation beyond CSS transitions already defined
- Dark mode
- Accessibility beyond standard semantic HTML (no ARIA enhancements specced)

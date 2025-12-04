# KanBan Board

A simple, responsive Kanban-style task management board built with **HTML**, **CSS**, and **Vanilla JavaScript**.  
Tasks can be added, dragged across columns (To-Do → In Progress → Done), and deleted with confirmation.  
All tasks are stored in **localStorage**, so your board state persists across page reloads.

---

## Features

- **Three-column Kanban layout**
  - To-Do
  - To-Progress
  - Done

- **Drag & Drop Tasks**
  - Drag tasks between columns to update their status.
  - Visual highlight on columns while dragging.

- **Add Task Modal**
  - “Add new Task” button opens a modal.
  - Enter task title and optional description.
  - Tasks are added to the **To-Do** column by default.

- **Delete Confirmation Modal**
  - Clicking “Delete” on a task opens a confirmation modal.
  - Prevents accidental deletion.
  - Full-screen overlay with blurred background for focus.

- **Task Completion Flow Highlight**
  - Tasks that move from To-Do → Progress → Done get a special styling and glow effect.

- **Persistent Storage**
  - Tasks are stored in `localStorage` using the key `kanban_tasks`.
  - Board state is restored when you reopen or refresh the page.
  - A sample “Example Task” is seeded if no data is found.

- **Animated CTA Buttons**
  - Primary action buttons (`.task-btn.cta`) use a continuous glowing border animation.
  - Smooth hover and active effects for better UX.

---

## Tech Stack

- **HTML5**
- **CSS3**
  - Custom properties (CSS variables)
  - Animations and transitions
  - Responsive layout using flexbox
- **Vanilla JavaScript (ES6+)**
  - DOM manipulation
  - Drag & Drop logic
  - LocalStorage for persistence
  - Modal handling and event listeners

---

## Project Structure

```bash
.
├── index.html    # Main HTML file
├── style.css     # All styles for layout, buttons, modals, and animations
└── script.js     # Kanban logic, drag & drop, modals, and localStorage
Getting Started
1. Clone or Download
bash
Copy code
git clone <your-repo-url>
cd <your-repo-folder>
Or simply download the files and place them in the same directory.

2. Open in Browser
You can run the project directly by opening index.html in any modern browser:

Double-click index.html, or

Use a local server (recommended), for example with VS Code Live Server or any static server.

No build step or dependencies are required.

How It Works
Task Data Model
Each task in tasksState follows this structure:

js
Copy code
{
  id: string,              // unique ID (generated via crypto.randomUUID)
  title: string,           // task title
  desc: string,            // optional task description
  status: "todo" | "progress" | "done",
  hasBeenInProgress: bool  // used to style tasks that moved through progress to done
}
Tasks are stored in localStorage under:

js
Copy code
const STORAGE_KEY = "kanban_tasks";
Drag & Drop
Each task element is set as draggable="true".

While dragging:

The task’s id is stored in draggedTaskId.

Columns listen for dragenter, dragover, dragleave, and drop.

On drop:

The status of the corresponding task is updated based on the target column.

If dropped into Progress, hasBeenInProgress is set to true.

If later moved to Done, the task gets a special “completed flow” style.

Modals
Add Task Modal

Triggered by the “Add new Task” button (#toggle-modal).

Closed by clicking the background overlay or pressing Escape.

Delete Confirm Modal

Triggered by clicking the Delete button on a task.

Stores the pendingDeleteTaskId until confirmed or cancelled.

Closed by clicking the background overlay, “No, keep it”, or pressing Escape.

Customization
You can easily customize:

Colors, spacing, and radii via CSS variables in the :root section.

Button animations by adjusting the @keyframes glowing or hover/active styles.

Column names by editing the heading text in index.html.

Initial seed task by modifying the default task in loadTasks() inside script.js.

Browser Support
The project uses:

flexbox

CSS variables

crypto.randomUUID()

localStorage

It should work in all modern browsers. Older browsers that do not support these APIs may not be fully compatible.

// ---- Column references ----
const todo = document.querySelector("#to-do");
const progress = document.querySelector("#to-progress");
const done = document.querySelector("#done");

// ---- Modal elements (Add Task) ----
const toggleModalButton = document.querySelector("#toggle-modal");
const addTaskModal = document.querySelector("#add-task-modal");
const addTaskModalBg = addTaskModal.querySelector(".bg");
const addTaskButton = document.querySelector("#add-new-task");
const taskTitleInputEl = document.querySelector("#task-title-input");
const taskDescInputEl = document.querySelector("#task-desc-input");

// ---- Modal elements (Delete Confirm) ----
const deleteModal = document.querySelector("#delete-confirm-modal");
const deleteModalBg = deleteModal.querySelector(".bg");
const confirmDeleteBtn = document.querySelector("#confirm-delete");
const cancelDeleteBtn = document.querySelector("#cancel-delete");

// localStorage key
const STORAGE_KEY = "kanban_tasks";

// task state: array of { id, title, desc, status, hasBeenInProgress }
let tasksState = [];

// for drag handling
let draggedTaskId = null;

// for delete confirm
let pendingDeleteTaskId = null;

// --------- LocalStorage helpers ---------
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksState));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // seed with one default task
    tasksState = [
      {
        id: crypto.randomUUID(),
        title: "Example Task!",
        desc: "Example Description",
        status: "todo",
        hasBeenInProgress: false,
      },
    ];
    saveTasks();
  } else {
    try {
      tasksState = JSON.parse(raw) || [];
    } catch {
      tasksState = [];
    }
  }
}

// --------- Rendering ---------
function clearColumns() {
  [todo, progress, done].forEach((col) => {
    const children = Array.from(col.children).slice(1); // keep heading
    children.forEach((child) => child.remove());
  });
}

function createTaskElement(task) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("task");
  wrapper.setAttribute("draggable", "true");
  wrapper.dataset.id = task.id;

  if (task.status === "done" && task.hasBeenInProgress) {
    wrapper.classList.add("task-completed-flow");
  }

  wrapper.innerHTML = `
    <div class="task-title">
      <h3>${task.title}</h3>
      <p class="desc">${task.desc || ""}</p>
      <button class="btn dlt-btn">Delete</button>
    </div>
  `;

  // drag events
  wrapper.addEventListener("dragstart", () => {
    draggedTaskId = task.id;
  });
  wrapper.addEventListener("dragend", () => {
    draggedTaskId = null;
  });

  // delete button opens confirm modal
  const deleteButton = wrapper.querySelector(".dlt-btn");
  deleteButton.addEventListener("click", () => {
    pendingDeleteTaskId = task.id;
    openDeleteModal();
  });

  return wrapper;
}

function getColumnElementByStatus(status) {
  if (status === "todo") return todo;
  if (status === "progress") return progress;
  if (status === "done") return done;
  return todo;
}

function renderAll() {
  clearColumns();

  tasksState.forEach((task) => {
    const col = getColumnElementByStatus(task.status);
    const el = createTaskElement(task);
    col.appendChild(el);
  });

  updateTaskCounts();
}

// --------- Task counts ---------
function updateTaskCounts() {
  [todo, progress, done].forEach((col) => {
    const tasksInCol = col.querySelectorAll(".task");
    const countEl = col.querySelector(".heading .right");
    countEl.innerText = `Count: ${tasksInCol.length}`;
  });
}

// --------- Drag & drop on columns ---------
function addDragEventOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");

    if (!draggedTaskId) return;

    const newStatus = column.dataset.status; // "todo" | "progress" | "done"
    const task = tasksState.find((t) => t.id === draggedTaskId);
    if (!task) return;

    if (newStatus === "progress") {
      task.hasBeenInProgress = true;
    }
    task.status = newStatus;

    saveTasks();
    renderAll();
  });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

// --------- Add Task Modal logic ---------
toggleModalButton.addEventListener("click", () => {
  addTaskModal.classList.toggle("active");
});

addTaskModalBg.addEventListener("click", () => {
  addTaskModal.classList.remove("active");
});

// close add-task modal on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    addTaskModal.classList.remove("active");
    deleteModal.classList.remove("active");
    pendingDeleteTaskId = null;
  }
});

// --------- Add Task logic ---------
addTaskButton.addEventListener("click", () => {
  const title = taskTitleInputEl.value.trim();
  const desc = taskDescInputEl.value.trim();

  if (!title) {
    taskTitleInputEl.focus();
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    title,
    desc,
    status: "todo",
    hasBeenInProgress: false,
  };

  tasksState.push(newTask);
  saveTasks();
  renderAll();

  taskTitleInputEl.value = "";
  taskDescInputEl.value = "";
  addTaskModal.classList.remove("active");
});

// --------- Delete Confirm Modal logic ---------
function openDeleteModal() {
  deleteModal.classList.add("active");
}

function closeDeleteModal() {
  deleteModal.classList.remove("active");
  pendingDeleteTaskId = null;
}

deleteModalBg.addEventListener("click", closeDeleteModal);
cancelDeleteBtn.addEventListener("click", closeDeleteModal);

confirmDeleteBtn.addEventListener("click", () => {
  if (!pendingDeleteTaskId) {
    closeDeleteModal();
    return;
  }
  tasksState = tasksState.filter((t) => t.id !== pendingDeleteTaskId);
  saveTasks();
  renderAll();
  closeDeleteModal();
});

// --------- Init ---------
loadTasks();
renderAll();

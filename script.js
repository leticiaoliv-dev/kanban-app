// ==========================
// 📦 1. Estrutura de dados
// ==========================
let tasks = {
  todo: [],
  doing: [],
  done: []
};

// ==========================
// 💾 2. Salvar
// ==========================
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// ==========================
// 📥 3. Carregar
// ==========================
function loadTasks() {
  const saved = localStorage.getItem("kanbanTasks");

  if (saved) {
    tasks = JSON.parse(saved);
  }

  renderTasks();
}

// ==========================
// 🎨 4. Renderizar
// ==========================
function renderTasks() {

  document.querySelectorAll(".task-list").forEach(list => {
    list.innerHTML = "";
  });

  for (let column in tasks) {

    const columnElement = document.getElementById(column);
    const title = columnElement.querySelector("h2");

    const names = {
      todo: "A fazer",
      doing: "Em andamento",
      done: "Concluído"
    };

    title.textContent = `${names[column]} (${tasks[column].length})`;

    tasks[column].forEach((taskData) => {

      const task = document.createElement("div");
      task.classList.add("task");

      // 🎨 Cor por categoria
      const colors = {
        "Estudo": "#3b82f6",
        "Trabalho": "#22c55e",
        "Pessoal": "#ef4444"
      };

      task.style.borderLeft = `5px solid ${colors[taskData.category] || "#999"}`;

      // 📝 TEXTO
      const span = document.createElement("span");
      span.textContent = `${taskData.text} (${taskData.category || "Sem categoria"})`;

      // ✏️ EDITAR
      span.addEventListener("dblclick", () => {
        const newText = prompt("Editar tarefa:", taskData.text);

        if (newText) {
          taskData.text = newText;
          saveTasks();
          renderTasks();
        }
      });

      // ❌ DELETAR
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";

      deleteBtn.addEventListener("click", () => {
        tasks[column] = tasks[column].filter(t => t.id !== taskData.id);
        saveTasks();
        renderTasks();
      });

      task.appendChild(span);
      task.appendChild(deleteBtn);

      // 🖱️ DRAG
      task.draggable = true;

      task.addEventListener("dragstart", () => {
        draggedTask = taskData;
        draggedTask.column = column;
      });

      document
        .querySelector(`#${column} .task-list`)
        .appendChild(task);
    });
  }
}

// ==========================
// ➕ 5. Criar tarefa
// ==========================
function addTask(columnId, text, category) {
  tasks[columnId].push({
    id: Date.now(),
    text: text,
    category: category
  });

  saveTasks();
  renderTasks();
}

// ==========================
// 🖱️ 6. Drag and Drop
// ==========================
let draggedTask = null;

document.querySelectorAll(".task-list").forEach((list) => {

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    list.classList.add("drag-over");
  });

  list.addEventListener("dragleave", () => {
    list.classList.remove("drag-over");
  });

  list.addEventListener("drop", () => {

    list.classList.remove("drag-over");

    if (draggedTask) {

      const newColumn = list.parentElement.id;

      tasks[draggedTask.column] =
        tasks[draggedTask.column].filter(t => t.id !== draggedTask.id);

      tasks[newColumn].push(draggedTask);

      saveTasks();
      renderTasks();
    }
  });
});

// ==========================
// 👤 7. Nome do usuário
// ==========================
function setUserName() {
  let name = localStorage.getItem("kanbanUser");

  if (!name) {
    name = prompt("Digite seu nome:");
    localStorage.setItem("kanbanUser", name);
  }

  document.getElementById("welcome").textContent =
    `Olá, ${name} 👋`;
}

// ==========================
// 🪟 8. MODAL
// ==========================
let currentColumn = null;

function openModal(columnId) {
  currentColumn = columnId;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("taskInput").value = "";
}

function saveTask() {
  const text = document.getElementById("taskInput").value;
  const category = document.getElementById("category").value;

  if (!text) return;

  addTask(currentColumn, text, category);

  closeModal();
}

// ==========================
// 🌙 9. TEMA DARK / LIGHT
// ==========================
function toggleTheme() {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// ==========================
// ▶️ 10. Inicialização
// ==========================
loadTasks();
setUserName();

// carregar tema salvo
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
}
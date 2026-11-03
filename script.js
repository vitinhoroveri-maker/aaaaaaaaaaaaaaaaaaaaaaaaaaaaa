"use strict";

// TaskFlow usa apenas o armazenamento local do navegador.
const STORAGE_KEY = "taskflow_tarefas_v1";
const STATUS = ["pendente", "andamento", "concluida"];
const PRIORIDADES = ["baixa", "media", "alta"];
const STATUS_LABELS = { pendente: "A fazer", andamento: "Em andamento", concluida: "Concluída" };
const PRIORIDADE_LABELS = { baixa: "Baixa", media: "Média", alta: "Alta" };

const $ = (selector) => document.querySelector(selector);
let tasks = loadTasks();
let toastTimer;

function isValidTask(task) {
  return task && typeof task.id === "string" && typeof task.title === "string" &&
    typeof task.description === "string" && PRIORIDADES.includes(task.priority) &&
    STATUS.includes(task.status) && typeof task.deadline === "string";
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Formato inválido");
    return parsed.filter(isValidTask);
  } catch (error) {
    console.warn("Não foi possível carregar as tarefas:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Erro ao salvar tarefas:", error);
    notify("Não foi possível salvar. Verifique o armazenamento do navegador.");
    return false;
  }
}

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3100);
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function commitChanges(nextTasks, message) {
  const previous = tasks;
  tasks = nextTasks;
  if (!saveTasks()) { tasks = previous; render(); return false; }
  render();
  if (message) notify(message);
  return true;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function formatDate(dateString) {
  if (!dateString) return "Sem prazo definido";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "Sem prazo definido";
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function isOverdue(task) {
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return task.deadline && task.deadline < localToday && task.status !== "concluida";
}

function createTaskCard(task) {
  const card = createElement("article", "task-card");
  const top = createElement("div", "task-card-top");
  top.append(createElement("span", `priority priority-${task.priority}`, `● ${PRIORIDADE_LABELS[task.priority]}`));
  card.append(top, createElement("h4", "", task.title));
  if (task.description.trim()) card.append(createElement("p", "task-description", task.description));
  const date = createElement("p", `task-date${isOverdue(task) ? " overdue" : ""}`, `${isOverdue(task) ? "⚠ Atrasada · " : "◷ "}${formatDate(task.deadline)}`);
  card.append(date);

  const controls = createElement("div", "task-controls");
  const statusSelect = createElement("select");
  statusSelect.setAttribute("aria-label", `Alterar status de ${task.title}`);
  STATUS.forEach((status) => {
    const option = createElement("option", "", STATUS_LABELS[status]);
    option.value = status;
    option.selected = task.status === status;
    statusSelect.append(option);
  });
  statusSelect.addEventListener("change", () => {
    commitChanges(tasks.map((item) => item.id === task.id ? { ...item, status: statusSelect.value } : item), "Status atualizado!");
  });

  const editButton = createElement("button", "", "Editar");
  editButton.type = "button";
  editButton.setAttribute("aria-label", `Editar ${task.title}`);
  editButton.addEventListener("click", () => startEditing(task.id));

  const deleteButton = createElement("button", "delete", "Excluir");
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Excluir ${task.title}`);
  deleteButton.addEventListener("click", () => {
    if (window.confirm(`Deseja excluir a tarefa "${task.title}"?`)) {
      if (commitChanges(tasks.filter((item) => item.id !== task.id), "Tarefa excluída!")) resetForm();
    }
  });
  controls.append(statusSelect, editButton, deleteButton);
  card.append(controls);
  return card;
}

function getFilteredTasks() {
  const search = $("#search").value.trim().toLocaleLowerCase("pt-BR");
  const priority = $("#filter-priority").value;
  const status = $("#filter-status").value;
  return tasks.filter((task) => task.title.toLocaleLowerCase("pt-BR").includes(search) &&
    (priority === "todas" || task.priority === priority) &&
    (status === "todos" || task.status === status));
}

function render() {
  const total = tasks.length;
  const counts = Object.fromEntries(STATUS.map((status) => [status, tasks.filter((task) => task.status === status).length]));
  $("#stat-total").textContent = total;
  STATUS.forEach((status) => { $(`#stat-${status}`).textContent = counts[status]; });
  const percentage = total ? Math.round(counts.concluida / total * 100) : 0;
  $("#progress-percent").textContent = `${percentage}%`;
  $("#progress-bar").style.width = `${percentage}%`;

  const filtered = getFilteredTasks();
  STATUS.forEach((status) => {
    const list = $(`#list-${status}`);
    list.replaceChildren();
    const visible = filtered.filter((task) => task.status === status);
    $(`#count-${status}`).textContent = visible.length;
    if (!visible.length) {
      const empty = createElement("div", "empty-state");
      empty.append(createElement("span", "", "☷"), document.createTextNode("Nenhuma tarefa nesta coluna."));
      list.append(empty);
    } else {
      visible.forEach((task) => list.append(createTaskCard(task)));
    }
  });
}

function resetForm() {
  $("#task-form").reset();
  $("#task-id").value = "";
  $("#form-title").textContent = "Adicionar tarefa";
  $("#submit-task").textContent = "＋ Adicionar tarefa";
  $("#cancel-edit").hidden = true;
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  $("#task-id").value = task.id;
  $("#task-title").value = task.title;
  $("#task-description").value = task.description;
  $("#task-priority").value = task.priority;
  $("#task-deadline").value = task.deadline;
  $("#form-title").textContent = "Editar tarefa";
  $("#submit-task").textContent = "Salvar alterações";
  $("#cancel-edit").hidden = false;
  $("#nova-tarefa").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#task-title").focus({ preventScroll: true });
}

$("#task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = $("#task-title").value.trim();
  if (!title) { notify("Informe um título para a tarefa."); $("#task-title").focus(); return; }
  const priority = $("#task-priority").value;
  if (!PRIORIDADES.includes(priority)) return;
  const details = { title, description: $("#task-description").value.trim(), priority, deadline: $("#task-deadline").value };
  const id = $("#task-id").value;
  if (id) {
    if (!tasks.some((task) => task.id === id)) { notify("Tarefa não encontrada."); resetForm(); return; }
    if (commitChanges(tasks.map((task) => task.id === id ? { ...task, ...details } : task), "Tarefa atualizada!")) resetForm();
  } else {
    if (commitChanges([...tasks, { id: generateId(), ...details, status: "pendente" }], "Tarefa adicionada!")) resetForm();
  }
});

$("#cancel-edit").addEventListener("click", resetForm);
["#search", "#filter-priority", "#filter-status"].forEach((selector) => {
  $(selector).addEventListener(selector === "#search" ? "input" : "change", render);
});
$("#clear-filters").addEventListener("click", () => {
  $("#search").value = "";
  $("#filter-priority").value = "todas";
  $("#filter-status").value = "todos";
  render();
});
$("#today").textContent = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
render();

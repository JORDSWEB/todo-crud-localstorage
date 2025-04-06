document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskTypeInput = document.getElementById('taskType');
const taskDescInput = document.getElementById('taskDesc');
const bgColorInput = document.getElementById('bgColor');
const taskIdInput = document.getElementById('taskId');
const tasksContainer = document.getElementById('tasksContainer');
const clearAllBtn = document.getElementById('clearAllBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

taskForm.addEventListener('submit', saveTask);
clearAllBtn.addEventListener('click', clearAllTasks);
cancelEditBtn.addEventListener('click', cancelEdit);

function saveTask(e) {
  e.preventDefault();
  
  const taskName = taskNameInput.value.trim();
  const taskType = taskTypeInput.value;
  const taskDesc = taskDescInput.value.trim();
  const bgColor = bgColorInput.value;
  const taskId = taskIdInput.value;
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  if (taskId) {
    // Update an existing task
    tasks = tasks.map(task => {
      if (task.id === taskId) {
        return { id: taskId, name: taskName, type: taskType, description: taskDesc, bgColor: bgColor };
      }
      return task;
    });
  } else {
    // Create a new task
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      type: taskType,
      description: taskDesc,
      bgColor: bgColor
    };
    tasks.push(newTask);
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskForm.reset();
  taskIdInput.value = '';
  cancelEditBtn.style.display = 'none';
  loadTasks();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasksContainer.innerHTML = '';
  
  tasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.style.backgroundColor = task.bgColor;
    
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
    
    const title = document.createElement('h3');
    title.textContent = task.name;
    
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    taskButtons.appendChild(editBtn);
    taskButtons.appendChild(deleteBtn);
    
    taskHeader.appendChild(title);
    taskHeader.appendChild(taskButtons);
    
    const typePara = document.createElement('p');
    typePara.textContent = `Type: ${task.type}`;
    
    const descPara = document.createElement('p');
    descPara.textContent = task.description;
    
    taskCard.appendChild(taskHeader);
    taskCard.appendChild(typePara);
    taskCard.appendChild(descPara);
    
    tasksContainer.appendChild(taskCard);
  });
}

function editTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskToEdit = tasks.find(task => task.id === id);
  if (taskToEdit) {
    taskNameInput.value = taskToEdit.name;
    taskTypeInput.value = taskToEdit.type;
    taskDescInput.value = taskToEdit.description;
    bgColorInput.value = taskToEdit.bgColor;
    taskIdInput.value = taskToEdit.id;
    cancelEditBtn.style.display = 'inline-block';
  }
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function clearAllTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    localStorage.removeItem('tasks');
    loadTasks();
  }
}

function cancelEdit() {
  taskForm.reset();
  taskIdInput.value = '';
  cancelEditBtn.style.display = 'none';
}


let tasks = [];
let currentFilter = 'all';
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    alert("Please enter a task.")
    return;
  }
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };
  tasks.push(newTask);
  taskInput.value = '';
  render();
}
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  render();
}
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}
function render() {
  taskList.innerHTML = '';  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });  
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn">&times;</button>
    `;  
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTask(task.id));    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });  
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  pendingCountEl.textContent = `Pending: ${pendingCount}`;
  completedCountEl.textContent = `Completed: ${completedCount}`;
}
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});
render();

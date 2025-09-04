// Motivational Quotes
const quotes = [
  "Small habits grow into big results.",
  "Consistency is the key to success.",
  "Every day is a fresh start.",
  "Progress, not perfection!",
  "Great things take time.",
  "Your future depends on what you do today.",
  "You’ve got this!",
  "Celebrate every little win."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Habit Data Structure
function loadHabits() {
  return JSON.parse(localStorage.getItem('habits') || '[]');
}

function saveHabits(habits) {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// UI Elements
const habitInput = document.getElementById('habitInput');
const addHabitForm = document.getElementById('addHabitForm');
const habitList = document.getElementById('habitList');
const progressDashboard = document.getElementById('progressDashboard');
const quoteElem = document.getElementById('quote');
const themeBtn = document.getElementById('themeBtn');

let habits = loadHabits();

// Show Quote
function showQuote() {
  quoteElem.textContent = getRandomQuote();
}
showQuote();

// Render Habits
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, idx) => {
    const li = document.createElement('li');
    li.className = 'habit-item' + (habit.completedToday ? ' completed' : '');
    li.innerHTML = `
      <span>
        <span class="streak">🔥 ${habit.streak}d</span> 
        ${habit.name}
      </span>
      <span class="habit-actions">
        <button title="Complete for today" onclick="completeHabit(${idx})">✅</button>
        <button title="Edit habit" onclick="editHabit(${idx})">✏️</button>
        <button title="Delete habit" onclick="deleteHabit(${idx})">🗑️</button>
      </span>
    `;
    habitList.appendChild(li);
  });
  renderProgress();
}

// Add Habit
addHabitForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = habitInput.value.trim();
  if (!name) return;
  habits.push({ name, streak: 0, completedToday: false, history: [] });
  saveHabits(habits);
  habitInput.value = '';
  renderHabits();
});

// Complete Habit
window.completeHabit = function(idx) {
  const habit = habits[idx];
  if (!habit.completedToday) {
    habit.completedToday = true;
    habit.streak += 1;
    habit.history.push(new Date().toISOString().split('T')[0]);
    if ([7, 14, 21, 30].includes(habit.streak)) {
      showConfetti(`🎉 ${habit.streak}-day streak! Keep going!`);
    }
  }
  saveHabits(habits);
  renderHabits();
};

// Edit Habit
window.editHabit = function(idx) {
  const newName = prompt('Edit habit name:', habits[idx].name);
  if (newName) {
    habits[idx].name = newName.trim();
    saveHabits(habits);
    renderHabits();
  }
};

// Delete Habit
window.deleteHabit = function(idx) {
  if (confirm('Delete this habit?')) {
    habits.splice(idx, 1);
    saveHabits(habits);
    renderHabits();
  }
};

// Render Progress Dashboard
function renderProgress() {
  progressDashboard.innerHTML = '';
  habits.forEach(habit => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${habit.name}:</strong>
      <div class="progress-bar">
        <div class="progress-bar-inner" style="width:${Math.min(habit.streak, 30) * 3.3}%"></div>
      </div>
      <span>Streak: ${habit.streak} days</span>
    `;
    progressDashboard.appendChild(div);
  });
}

// Confetti Animation
function showConfetti(message) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.textContent = message;
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1200);
}

// Daily Reset (at midnight)
function dailyReset() {
  const today = new Date().toISOString().split('T')[0];
  habits.forEach(habit => {
    if (habit.history[habit.history.length - 1] !== today) {
      habit.completedToday = false;
    }
  });
  saveHabits(habits);
  renderHabits();
}
setInterval(dailyReset, 1000 * 60 * 30); // Recheck every 30 mins

// Theme Switcher
const themes = [
  { '--main-bg': '#f4f9ff', '--accent': '#6c63ff', '--card-bg': '#fff', '--text': '#222' },
  { '--main-bg': '#222', '--accent': '#FFD700', '--card-bg': '#333', '--text': '#f4f9ff' },
  { '--main-bg': '#ffe4e1', '--accent': '#e75480', '--card-bg': '#fffaf0', '--text': '#900C3F' }
];
let themeIdx = 0;
themeBtn.addEventListener('click', () => {
  themeIdx = (themeIdx + 1) % themes.length;
  Object.entries(themes[themeIdx]).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
});

renderHabits();
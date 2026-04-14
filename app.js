/**
 * NEO_TASK // CORE LOGIC
 * Handles State, LocalStorage, Routing, and DOM Updates.
 */

// --- 1. SYSTEM CONFIG & INITIAL STATE ---
const XP_PER_LEVEL = 1000;
const DB_KEY = 'NEO_TASK_DB';

// Default schema if localStorage is empty
const defaultDatabase = {
    activeUserId: 'usr_01',
    users: {
        'usr_01': {
            id: 'usr_01',
            username: 'OPERATOR_01',
            level: 42,
            xp: 850,
            streak: 12,
            lastLogin: new Date().toISOString(),
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqVzq5x83N7E5MEspfG1L4IaOkFfeTDFYQ2LQr1lDYqJCLtbeUxA-Tgi6HfH4hS9aNjxiVqtfIIaKVLlbv8SNnTm3Lx6_TO26LkO49CSxniaD3LxPkWF74A2DIA8E7x6KvQxG6_3WyiCDpuH3DM11bjP5zwZFFNLeOB6KlNRg1gHynqZPauDPxa2vDvdwJDzL07QiMqQ0mfkOWyYueZd0-12enmQpBQpWtLOcY_tDpxjqi8IJGb7D8672woczzJRdRg5XK6p73lSp4'
        },
        'usr_02': {
            id: 'usr_02',
            username: 'NETRUNNER_99',
            level: 15,
            xp: 200,
            streak: 1,
            lastLogin: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            avatar: 'http://googleusercontent.com/profile/picture/2'
        }
    },
    tasks: [
        { id: 't_1', userId: 'usr_01', title: 'Patch Vulnerability in Core Module', type: 'CRITICAL', xp: 500, status: 'PENDING', category: 'TASK' },
        { id: 't_2', userId: 'usr_01', title: 'Weekly Synthesis Report', type: 'MEDIUM', xp: 250, status: 'PENDING', category: 'TASK' },
        { id: 't_3', userId: 'usr_01', title: 'GYM_PROTOCOL', type: 'DAILY', xp: 200, status: 'PENDING', category: 'QUEST' },
        { id: 't_4', userId: 'usr_02', title: 'Hack the Gibson', type: 'CRITICAL', xp: 1000, status: 'PENDING', category: 'TASK' }
    ]
};

// --- 2. DATABASE UTILS ---
function getDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : defaultDatabase;
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    renderApp(); // Trigger a re-render whenever data changes
}

// --- 3. CORE MECHANICS ---
function checkAndProcessStreak(db) {
    const user = db.users[db.activeUserId];
    const today = new Date().setHours(0, 0, 0, 0);
    const lastLogin = new Date(user.lastLogin).setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        user.streak += 1; // Logged in consecutive day
    } else if (diffDays > 1) {
        user.streak = 1; // Streak broken
    }

    user.lastLogin = new Date().toISOString();
    return db;
}

function addXP(amount) {
    const db = getDB();
    const user = db.users[db.activeUserId];

    user.xp += amount;

    // Level up logic
    if (user.xp >= XP_PER_LEVEL) {
        const levelsGained = Math.floor(user.xp / XP_PER_LEVEL);
        user.level += levelsGained;
        user.xp = user.xp % XP_PER_LEVEL;
        alert(`⚡ LEVEL UP! You are now LVL ${user.level}`);
    }

    saveDB(db);
}

// Global function to trigger from DOM
window.completeTask = function (taskId) {
    const db = getDB();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId && t.userId === db.activeUserId);

    if (taskIndex !== -1 && db.tasks[taskIndex].status !== 'COMPLETED') {
        db.tasks[taskIndex].status = 'COMPLETED';
        const reward = db.tasks[taskIndex].xp;
        saveDB(db); // Save task completion
        addXP(reward); // Grant XP (which saves again and re-renders)
    }
};

window.switchUser = function (userId) {
    const db = getDB();
    if (db.users[userId]) {
        db.activeUserId = userId;
        saveDB(checkAndProcessStreak(db));
    }
};

// --- 4. DOM RENDERING ---
function renderHeader(user) {
    const xpPercentage = Math.floor((user.xp / XP_PER_LEVEL) * 100);

    // Update Desktop Header
    document.querySelector('header').innerHTML = `
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shadow-[0_0_10px_rgba(223,142,255,0.5)] cursor-pointer" onclick="switchUser('${user.id === 'usr_01' ? 'usr_02' : 'usr_01'}')" title="Click to switch user">
                <img alt="avatar" class="w-full h-full object-cover" src="${user.avatar}" />
            </div>
            <span class="font-headline tracking-widest uppercase text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600">NEO_TASK</span>
        </div>
        <div class="hidden md:flex flex-col items-center gap-1 min-w-[300px]">
            <div class="flex justify-between w-full text-[10px] font-label text-secondary tracking-tighter">
                <span>LVL ${user.level} ${user.username}</span>
                <span>XP: ${xpPercentage}%</span>
            </div>
            <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-secondary to-secondary-dim shadow-[0_0_10px_rgba(0,238,252,0.8)] transition-all duration-500" style="width: ${xpPercentage}%"></div>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full border border-orange-500/30">
                <span class="material-symbols-outlined text-orange-500 text-sm" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                <span class="font-label font-bold text-orange-400">${user.streak} DAY STREAK</span>
            </div>
        </div>
    `;

    // Update Sidebar Profile
    const sidebarProfile = document.querySelector('aside .px-6.mb-8');
    if (sidebarProfile) {
        sidebarProfile.innerHTML = `
            <h2 class="font-headline font-black text-cyan-400 text-lg mb-1">${user.username}</h2>
            <p class="font-label text-zinc-500 text-xs tracking-tighter">LVL ${user.level} NETRUNNER</p>
        `;
    }
}

function renderTasksList(db, view = 'tasks') {
    const mainCanvas = document.querySelector('main');
    const userTasks = db.tasks.filter(t => t.userId === db.activeUserId);

    if (view === 'tasks') {
        const pendingTasks = userTasks.filter(t => t.status === 'PENDING' && t.category === 'TASK');

        // Map tasks to HTML
        const tasksHTML = pendingTasks.map(task => `
            <div class="glass-panel p-5 rounded border-l-4 border-l-${task.type === 'CRITICAL' ? 'error' : 'secondary'} border-y border-r border-white/5 transition-all">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <button onclick="completeTask('${task.id}')" class="w-6 h-6 border-2 border-white/20 rounded flex items-center justify-center hover:border-tertiary transition-colors">
                            <span class="material-symbols-outlined text-transparent hover:text-tertiary">check</span>
                        </button>
                        <h4 class="font-headline font-bold text-lg text-on-surface">${task.title}</h4>
                    </div>
                    <span class="px-2 py-0.5 bg-white/5 text-[10px] rounded border border-white/10">${task.type}</span>
                </div>
                <div class="flex items-center gap-6 mt-4 text-xs font-label text-on-surface-variant">
                    <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">military_tech</span>
                        <span>+${task.xp} XP</span>
                    </div>
                </div>
            </div>
        `).join('');

        mainCanvas.innerHTML = `
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <span class="material-symbols-outlined text-primary">format_list_bulleted</span>
                    <h3 class="font-headline text-2xl font-bold tracking-widest text-primary">ACTIVE_TASKS</h3>
                </div>
                <div class="grid grid-cols-1 gap-3">${tasksHTML || '<p class="text-zinc-500 font-label text-sm">No active tasks. System idle.</p>'}</div>
            </section>
        `;
    } else if (view === 'completed') {
        const completedTasks = userTasks.filter(t => t.status === 'COMPLETED');
        mainCanvas.innerHTML = `
            <section>
                <div class="flex items-center gap-3 mb-6">
                    <span class="material-symbols-outlined text-tertiary">check_circle</span>
                    <h3 class="font-headline text-2xl font-bold tracking-widest text-tertiary">ARCHIVE</h3>
                </div>
                <div class="grid grid-cols-1 gap-3">
                    ${completedTasks.map(task => `
                        <div class="glass-panel p-4 rounded border border-tertiary/20 opacity-60">
                            <h4 class="font-headline text-on-surface line-through">${task.title}</h4>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    } else if (view === 'settings') {
        mainCanvas.innerHTML = `
             <section>
                <h3 class="font-headline text-2xl font-bold tracking-widest text-zinc-400 mb-6">SYSTEM_SETTINGS</h3>
                <div class="glass-panel p-6 rounded border border-white/10">
                    <p class="font-label text-sm text-zinc-400 mb-4">Current Uplink: ${db.activeUserId}</p>
                    <button onclick="switchUser('usr_01')" class="px-4 py-2 bg-primary/20 text-primary rounded mr-2 hover:bg-primary/40">Load OPERATOR_01</button>
                    <button onclick="switchUser('usr_02')" class="px-4 py-2 bg-secondary/20 text-secondary rounded hover:bg-secondary/40">Load NETRUNNER_99</button>
                </div>
            </section>
        `;
    }
}
// Toggle the modal visibility
window.toggleTaskModal = function () {
    const modal = document.getElementById('task-modal');
    modal.classList.toggle('hidden');
    document.getElementById('new-task-title').value = ''; // Clear input on open
};

// Handle the task creation
window.submitNewTask = function () {
    const titleInput = document.getElementById('new-task-title').value.trim();
    const typeInput = document.getElementById('new-task-type').value;

    if (!titleInput) {
        alert("SYSTEM ERROR: Task designation cannot be empty.");
        return;
    }

    const db = getDB();

    // Determine XP based on type
    let xpReward = 100;
    if (typeInput === 'CRITICAL') xpReward = 500;
    if (typeInput === 'MEDIUM') xpReward = 250;

    // Create the new task object
    const newTask = {
        id: 't_' + Date.now(), // Generate a unique ID using the current timestamp
        user: db.activeUser,
        title: titleInput,
        type: typeInput,
        xp: xpReward,
        done: false
    };

    // Save and render
    db.tasks.push(newTask);
    saveDB(db);
    toggleTaskModal(); // Close the modal
};
// --- 5. ROUTER & INITIALIZATION ---
function handleRoute() {
    const hash = window.location.hash || '#tasks';
    const db = getDB();

    // Update sidebar active states
    document.querySelectorAll('aside nav a').forEach(link => {
        link.classList.remove('border-r-2', 'border-cyan-400', 'bg-cyan-500/5', 'text-cyan-400');
        link.classList.add('text-zinc-500');
        if (link.getAttribute('href') === hash) {
            link.classList.add('border-r-2', 'border-cyan-400', 'bg-cyan-500/5', 'text-cyan-400');
            link.classList.remove('text-zinc-500');
        }
    });

    renderTasksList(db, hash.replace('#', ''));
}

function renderApp() {
    let db = getDB();
    db = checkAndProcessStreak(db); // Process streak on every main render check

    renderHeader(db.users[db.activeUserId]);
    handleRoute();
}

// Setup Event Listeners
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
    // Ensure DB exists on first load
    if (!localStorage.getItem(DB_KEY)) saveDB(defaultDatabase);

    // Update Sidebar links to use hashes
    const navLinks = document.querySelectorAll('aside nav a');
    if (navLinks.length >= 3) {
        navLinks[0].setAttribute('href', '#tasks');
        navLinks[1].setAttribute('href', '#completed');
        navLinks[2].setAttribute('href', '#settings');
    }

    renderApp();
});
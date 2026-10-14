import type { StarterTemplate } from "@/types/preview";

export const HTML_STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "hello-world",
    name: "Hello World Card",
    description: "Modern animated greeting card with interactive click counter and responsive styling.",
    category: "Beginner",
    files: [
      {
        name: "index.html",
        path: "/index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OneCompilerHub — Hello World</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="container">
    <div class="card">
      <div class="badge">Live Playground</div>
      <h1 class="title">Hello, <span class="gradient-text">World!</span></h1>
      <p class="subtitle">
        Welcome to your isolated HTML, CSS & JavaScript preview sandbox.
      </p>

      <div class="counter-box">
        <button id="counter-btn" class="btn" type="button">
          Click me: <span id="count-value">0</span>
        </button>
        <button id="reset-btn" class="btn btn-outline" type="button">Reset</button>
      </div>

      <p id="feedback-msg" class="feedback">Click the button to test client-side JavaScript!</p>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "/style.css",
        language: "css",
        content: `/* Modern, accessible layout styling */
:root {
  --primary: #435bff;
  --primary-hover: #3246d8;
  --bg-gradient: linear-gradient(135deg, #0b0f19 0%, #131b2e 100%);
  --card-bg: rgba(26, 35, 58, 0.7);
  --card-border: rgba(67, 91, 255, 0.25);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.container {
  width: 100%;
  max-width: 480px;
}

.card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

.gradient-text {
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.counter-box {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.btn {
  background: var(--primary);
  color: #ffffff;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(67, 91, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
  box-shadow: none;
}

.feedback {
  font-size: 0.85rem;
  color: #38bdf8;
  min-height: 1.25rem;
}`,
      },
      {
        name: "script.js",
        path: "/script.js",
        language: "javascript",
        content: `// OneCompilerHub - Client-side Interactive Logic
console.log("🚀 Playground initialized successfully!");

let count = 0;
const countDisplay = document.getElementById("count-value");
const counterBtn = document.getElementById("counter-btn");
const resetBtn = document.getElementById("reset-btn");
const feedbackMsg = document.getElementById("feedback-msg");

counterBtn.addEventListener("click", () => {
  count += 1;
  countDisplay.textContent = count;
  feedbackMsg.textContent = \`You have clicked \${count} time\${count === 1 ? "" : "s"}!\`;
  console.log("Counter updated:", { clicks: count, timestamp: new Date().toISOString() });
});

resetBtn.addEventListener("click", () => {
  if (count === 0) return;
  console.info("Resetting counter from:", count);
  count = 0;
  countDisplay.textContent = "0";
  feedbackMsg.textContent = "Counter reset to zero.";
});
`,
      },
    ],
  },
  {
    id: "portfolio",
    name: "Personal Portfolio Card",
    description: "Responsive developer showcase profile with avatar, skill badges, and contact button.",
    category: "Portfolio",
    files: [
      {
        name: "index.html",
        path: "/index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="portfolio-card">
    <header class="header">
      <div class="avatar-wrapper">
        <div class="avatar">👨‍💻</div>
      </div>
      <h2>Alex Rivera</h2>
      <p class="role">Full-Stack Web Engineer</p>
    </header>

    <section class="bio">
      <p>Building high-performance, accessible web interfaces and resilient backend systems.</p>
    </section>

    <section class="skills">
      <h3>Core Technologies</h3>
      <div class="skill-tags">
        <span class="tag">HTML5</span>
        <span class="tag">CSS3</span>
        <span class="tag">JavaScript</span>
        <span class="tag">Next.js</span>
        <span class="tag">FastAPI</span>
      </div>
    </section>

    <footer class="actions">
      <button id="contact-btn" class="btn">Connect with Alex</button>
      <div id="status-alert" class="alert hidden">
        👋 Thank you for checking out my profile!
      </div>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "/style.css",
        language: "css",
        content: `body {
  margin: 0;
  padding: 2rem 1rem;
  background: #0f172a;
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

.portfolio-card {
  width: 100%;
  max-width: 440px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.avatar-wrapper {
  margin-bottom: 1rem;
}

.avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  border: 3px solid #60a5fa;
}

h2 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: #f8fafc;
}

.role {
  color: #38bdf8;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 1.5rem;
}

.bio p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.skills h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.tag {
  background: #334155;
  color: #e2e8f0;
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #475569;
}

.btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: #1d4ed8;
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  border-radius: 8px;
  font-size: 0.85rem;
}

.hidden {
  display: none;
}`,
      },
      {
        name: "script.js",
        path: "/script.js",
        language: "javascript",
        content: `console.log("Portfolio card loaded.");

const contactBtn = document.getElementById("contact-btn");
const alertBox = document.getElementById("status-alert");

contactBtn.addEventListener("click", () => {
  alertBox.classList.remove("hidden");
  console.info("User clicked connect button.");
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3500);
});
`,
      },
    ],
  },
  {
    id: "interactive-app",
    name: "Interactive Task App",
    description: "Full-featured client-side task checklist with add, toggle, and delete functionality.",
    category: "Web App",
    files: [
      {
        name: "index.html",
        path: "/index.html",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Checklist</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-card">
    <header class="app-header">
      <h2>Interactive Tasks</h2>
      <span id="task-counter" class="badge">0 tasks</span>
    </header>

    <form id="task-form" class="task-form">
      <input type="text" id="task-input" placeholder="What needs to be done?" required autocomplete="off">
      <button type="submit" class="add-btn">Add</button>
    </form>

    <ul id="task-list" class="task-list"></ul>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "/style.css",
        language: "css",
        content: `body {
  margin: 0;
  padding: 1.5rem;
  background: #090d16;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  box-sizing: border-box;
}

.app-card {
  width: 100%;
  max-width: 460px;
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 15px 30px rgba(0,0,0,0.5);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.app-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.badge {
  font-size: 0.75rem;
  background: #374151;
  color: #9ca3af;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.task-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.task-form input {
  flex: 1;
  background: #1f2937;
  border: 1px solid #374151;
  color: #f9fafb;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
}

.task-form input:focus {
  border-color: #6366f1;
}

.add-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.add-btn:hover {
  background: #4338ca;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1f2937;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.task-item.done span {
  text-decoration: line-through;
  color: #6b7280;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem 0.4rem;
}`,
      },
      {
        name: "script.js",
        path: "/script.js",
        language: "javascript",
        content: `console.log("Task checklist initialized.");

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("task-counter");

let tasks = [
  { id: 1, text: "Explore Monaco Editor in OneCompilerHub", done: true },
  { id: 2, text: "Try changing CSS colors in style.css", done: false },
  { id: 3, text: "Inspect console logs in Console Tab", done: false },
];

function updateUI() {
  list.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.className = \`task-item \${t.done ? "done" : ""}\`;
    li.innerHTML = \`
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" \${t.done ? "checked" : ""}>
        <span>\${t.text}</span>
      </label>
      <button class="delete-btn" type="button">✕</button>
    \`;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("change", () => {
      t.done = checkbox.checked;
      updateUI();
      console.log("Task toggled:", { text: t.text, done: t.done });
    });

    const del = li.querySelector(".delete-btn");
    del.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== t.id);
      updateUI();
      console.warn("Deleted task:", t.text);
    });

    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  counter.textContent = \`\${remaining} left of \${tasks.length}\`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  input.value = "";
  updateUI();
  console.info("Added new task:", text);
});

updateUI();
`,
      },
    ],
  },
];

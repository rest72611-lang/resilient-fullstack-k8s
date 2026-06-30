import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [health, setHealth] = useState("checking...");

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  async function checkHealth() {
    try {
      const res = await fetch("/health");
      const data = await res.json();
      setHealth(`${data.status} / db: ${data.db}`);
    } catch {
      setHealth("error");
    }
  }

  async function createTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    loadTasks();
  }

  async function toggleTask(id) {
    await fetch(`/api/tasks/${id}/toggle`, { method: "PATCH" });
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  useEffect(() => {
    checkHealth();
    loadTasks();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <p className="badge">Full Stack DevOps Demo</p>
        <h1>מערכת משימות פשוטה</h1>
        <p>
          React → Nginx → Node/Express → MySQL
        </p>

        <div className="health">
          Backend Health: <strong>{health}</strong>
        </div>

        <form onSubmit={createTask} className="form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="כתוב משימה..."
          />
          <button>הוסף</button>
        </form>

        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <span className={task.is_done ? "done" : ""}>{task.title}</span>
              <div>
                <button onClick={() => toggleTask(task.id)}>סמן</button>
                <button onClick={() => deleteTask(task.id)}>מחק</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

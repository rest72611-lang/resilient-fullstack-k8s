const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

async function getDb() {
  return mysql.createConnection({
    host: process.env.DB_HOST || "mysql",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "tasks_db",
  });
}

async function ensureTable() {
  const db = await getDb();
  await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      is_done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.end();
}

app.get("/live", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
  });
});

app.get("/health", async (req, res) => {
  try {
    const db = await getDb();
    await db.query("SELECT 1");
    await db.end();

    res.json({
      status: "ok",
      service: "backend",
      db: "connected",
      time: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      service: "backend",
      db: "disconnected",
      message: error.message,
    });
  }
});

app.get("/api/tasks", async (req, res) => {
  await ensureTable();
  const db = await getDb();
  const [rows] = await db.query("SELECT * FROM tasks ORDER BY id DESC");
  await db.end();
  res.json(rows);
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  await ensureTable();
  const db = await getDb();
  await db.query("INSERT INTO tasks (title) VALUES (?)", [title.trim()]);
  await db.end();

  res.status(201).json({ message: "Task created" });
});

app.patch("/api/tasks/:id/toggle", async (req, res) => {
  await ensureTable();
  const db = await getDb();
  await db.query("UPDATE tasks SET is_done = NOT is_done WHERE id = ?", [req.params.id]);
  await db.end();
  res.json({ message: "Task updated" });
});

app.delete("/api/tasks/:id", async (req, res) => {
  await ensureTable();
  const db = await getDb();
  await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
  await db.end();
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

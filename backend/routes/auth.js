const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const usersFile = path.join(__dirname, "../data/users.json");

// Helper: read users
function getUsers() {
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

// Helper: write users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// ─── Faculty Register ─────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const users = getUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: "FACULTY",
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ message: "Registration successful! Please login." });
});

// ─── Faculty Login ────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.role === "FACULTY");

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  res.json({
    message: "Login successful!",
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ─── Admin Register ───────────────────────────────────────────────────────────
router.post("/admin/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const users = getUsers();
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: "ADMIN",
  };

  users.push(newAdmin);
  saveUsers(users);

  res.json({ message: "Admin registered successfully! Please login." });
});

// ─── Admin Login ──────────────────────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();
  const admin = users.find((u) => u.email === email && u.role === "ADMIN");

  if (!admin) {
    return res.status(400).json({ message: "Invalid admin email or password." });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid admin email or password." });
  }

  res.json({
    message: "Admin login successful!",
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

module.exports = router;

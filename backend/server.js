const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Import route files
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const uploadRoutes = require("./routes/upload");
const adminRoutes = require("./routes/admin");

const app = express();

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve Uploaded Files ───────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Serve Frontend ─────────────────────────────────────────
// 👉 Change this ONLY if your folder name is different
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Default route → open index or register page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

// ─── Ensure Data Folder Exists ─────────────────────────────
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// JSON files
const usersFile = path.join(dataDir, "users.json");
const profilesFile = path.join(dataDir, "profiles.json");

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
if (!fs.existsSync(profilesFile)) fs.writeFileSync(profilesFile, "[]");

// ─── API Routes ─────────────────────────────────────────────
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", uploadRoutes);
app.use("/api", adminRoutes);

// ─── Handle Unknown Routes (Optional but good) ──────────────
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ─── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Ensure Data Folder Exists ─────────────────────────────
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const usersFile = path.join(dataDir, "users.json");
const profilesFile = path.join(dataDir, "profiles.json");

if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
if (!fs.existsSync(profilesFile)) fs.writeFileSync(profilesFile, "[]");

// ─── Serve Uploaded Files ───────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── ✅ API Routes FIRST (VERY IMPORTANT) ───────────────────
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", uploadRoutes);
app.use("/api", adminRoutes);

// ─── Serve Frontend AFTER API ───────────────────────────────
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

// ─── Handle Unknown Routes ──────────────────────────────────
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ─── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
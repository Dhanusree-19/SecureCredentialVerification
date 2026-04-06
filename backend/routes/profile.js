const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const profilesFile = path.join(__dirname, "../data/profiles.json");

// ✅ Safe read (prevents crash on Render)
function getProfiles() {
  try {
    if (!fs.existsSync(profilesFile)) return [];
    const data = fs.readFileSync(profilesFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading profiles:", err);
    return [];
  }
}

// ✅ Safe write
function saveProfiles(profiles) {
  try {
    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error("Error saving profiles:", err);
  }
}

// ─── Save / Update Profile ─────────────────────────────────
router.post("/profile", (req, res) => {
  const {
    userId, name, email, phone, department, designation,
    university, highestQualification, universityName,
    yearOfCompletion, specialization,
  } = req.body;

  if (!userId || !name || !email) {
    return res.status(400).json({ message: "userId, name, and email are required." });
  }

  const profiles = getProfiles();
  const existingIndex = profiles.findIndex((p) => p.userId === userId);
  const existing = existingIndex !== -1 ? profiles[existingIndex] : null;

  const profileData = {
    userId, name, email, phone, department, designation,
    university, highestQualification, universityName,
    yearOfCompletion, specialization,
    status:    existing ? existing.status    : "PENDING",
    remarks:   existing ? existing.remarks   : "",
    documents: existing ? existing.documents : {},
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    profiles[existingIndex] = profileData;
  } else {
    profiles.push(profileData);
  }

  saveProfiles(profiles);
  res.json({ message: "Profile saved successfully!" });
});

// ─── Get Profile ───────────────────────────────────────────
router.get("/profile/:userId", (req, res) => {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.userId === req.params.userId);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }

  res.json(profile);
});

// ─── ✅ Profile Check (IMPORTANT FIX) ───────────────────────
router.get("/profile-check/:userId", (req, res) => {
  try {
    const profiles = getProfiles();
    const exists = profiles.some((p) => p.userId === req.params.userId);

    console.log("PROFILE CHECK:", req.params.userId, "→", exists); // debug

    res.json({ exists });
  } catch (err) {
    console.error("Profile check error:", err);
    res.status(500).json({ exists: false });
  }
});

module.exports = router;
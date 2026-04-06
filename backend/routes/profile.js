const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const profilesFile = path.join(__dirname, "../data/profiles.json");

function getProfiles() {
  return JSON.parse(fs.readFileSync(profilesFile, "utf-8"));
}

function saveProfiles(profiles) {
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
}

// ─── Save / Update Profile ────────────────────────────────────────────────────
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

  // FIX Issue 1 (hidden cause) + Issue 3:
  // OLD CODE had status: "PENDING" hardcoded — this wiped REJECTED/VERIFIED on every edit.
  // FIX: preserve existing status, remarks, documents when updating.
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

// ─── Get Profile by userId ────────────────────────────────────────────────────
router.get("/profile/:userId", (req, res) => {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.userId === req.params.userId);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }

  res.json(profile);
});

// ─── FIX Issue 2: Check if profile exists (used after login) ─────────────────
// Frontend calls this after login. If exists → status.html, else → university.html
router.get("/profile-check/:userId", (req, res) => {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.userId === req.params.userId);
  res.json({ exists: !!profile });
});

module.exports = router;

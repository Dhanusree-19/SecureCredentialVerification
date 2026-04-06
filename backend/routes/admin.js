const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const profilesFile = path.join(__dirname, "../data/profiles.json");

function getProfiles() {
  return JSON.parse(fs.readFileSync(profilesFile, "utf-8"));
}

function saveProfiles(profiles) {
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
}

// ─── FIX Issue 4: Nodemailer with proper config + debug logs ─────────────────
// STEP 1: Replace your_email@gmail.com with your real Gmail
// STEP 2: Replace your_app_password with a Gmail App Password (NOT your login password)
//   How to get App Password:
//   → Go to myaccount.google.com → Security → 2-Step Verification → App Passwords
//   → Choose "Mail" → Copy the 16-character password → paste below
const GMAIL_USER = "dhanudhanu1903@@gmail.com";      // ← change this
const GMAIL_PASS = "regb agon bbbh gzmq";    // ← change this (16-char App Password)

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",      // explicit host (more reliable than service:"gmail")
  port: 587,                   // port 587 = TLS, works on most networks
  secure: false,               // false for port 587, true for port 465
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// Test the connection when server starts (shows error immediately if creds are wrong)
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email transporter error:", error.message);
    console.log("   → Check GMAIL_USER and GMAIL_PASS in backend/routes/admin.js");
  } else {
    console.log("Email transporter is ready to send emails!!");
  }
});

async function sendEmail(toEmail, toName, status, remarks) {
  const subject =
    status === "VERIFIED"
      ? "Your Faculty Credentials Have Been Verified"
      : "Your Faculty Credential Verification Was Rejected";

  const message =
    status === "VERIFIED"
      ? `Dear ${toName},\n\nCongratulations! Your faculty credentials have been successfully verified.\n\nBest regards,\nAdmin Team`
      : `Dear ${toName},\n\nWe regret to inform you that your faculty credentials have been rejected.\n\nRemarks: ${remarks || "No remarks provided."}\n\nPlease re-upload correct documents and resubmit.\n\nBest regards,\nAdmin Team`;

  console.log(`Attempting to send email to: ${toEmail}`);

  try {
    const info = await transporter.sendMail({
      from: `"Faculty Verification System" <${GMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: message,
    });
    console.log("Email sent successfully. Message ID:", info.messageId);
  } catch (err) {
    // Log full error so you can debug — app does NOT crash
    console.log("Email failed:", err.message);
  }
}

// ─── Get Faculty List (filtered by university) ────────────────────────────────
router.get("/faculty-list", (req, res) => {
  const { university } = req.query;
  const profiles = getProfiles();

  if (!university) {
    return res.json(profiles);
  }

  const filtered = profiles.filter(
    (p) => p.university && p.university.toLowerCase() === university.toLowerCase()
  );

  res.json(filtered);
});

// ─── Get Single Faculty Details ───────────────────────────────────────────────
router.get("/faculty/:userId", (req, res) => {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.userId === req.params.userId);

  if (!profile) {
    return res.status(404).json({ message: "Faculty not found." });
  }

  res.json(profile);
});

// ─── FIX Issue 1: Verify or Reject Faculty ───────────────────────────────────
// What was wrong:
//   1. The backend logic itself was correct
//   2. BUT profile.js was resetting status="PENDING" on every profile edit (fixed there)
//   3. Added console.log so you can see exactly what's happening in terminal
router.post("/verify", async (req, res) => {
  const { userId, action, remarks } = req.body;

  console.log("/verify called with:", { userId, action, remarks });

  if (!userId || !action) {
    return res.status(400).json({ message: "userId and action are required." });
  }

  if (action !== "VERIFIED" && action !== "REJECTED") {
    return res.status(400).json({ message: "Action must be VERIFIED or REJECTED." });
  }

  const profiles = getProfiles();
  const index = profiles.findIndex((p) => p.userId === userId);

  if (index === -1) {
    console.log("Faculty not found for userId:", userId);
    return res.status(404).json({ message: "Faculty not found." });
  }

  // Update status and remarks
  profiles[index].status = action;
  profiles[index].remarks = remarks || "";
  profiles[index].updatedAt = new Date().toISOString();

  // Save to JSON file
  saveProfiles(profiles);
  console.log(`Faculty ${profiles[index].name} status set to ${action}`);

  // Send email (non-blocking — won't crash if email fails)
  await sendEmail(profiles[index].email, profiles[index].name, action, remarks);

  res.json({ message: `Faculty has been ${action} successfully.` });
});

module.exports = router;

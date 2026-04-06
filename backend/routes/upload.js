const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profilesFile = path.join(__dirname, "../data/profiles.json");

function getProfiles() {
  return JSON.parse(fs.readFileSync(profilesFile, "utf-8"));
}

function saveProfiles(profiles) {
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
}

// ─── Multer Storage Config ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save as: userId_fieldname_timestamp.ext
    const userId = req.body.userId || "unknown";
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${file.fieldname}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Only allow PDF, JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, and PNG files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

// ─── Upload Documents ─────────────────────────────────────────────────────────
router.post(
  "/upload",
  upload.fields([
    { name: "degreeCertificate", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
  ]),
  (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const profiles = getProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);

    if (index === -1) {
      return res.status(404).json({ message: "Profile not found. Please complete your profile first." });
    }

    // Save filenames to profile
    const documents = profiles[index].documents || {};

    if (req.files["degreeCertificate"]) {
      documents.degreeCertificate = req.files["degreeCertificate"][0].filename;
    }
    if (req.files["idProof"]) {
      documents.idProof = req.files["idProof"][0].filename;
    }
    if (req.files["experienceCertificate"]) {
      documents.experienceCertificate = req.files["experienceCertificate"][0].filename;
    }

    profiles[index].documents = documents;
    profiles[index].status = "PENDING";
    profiles[index].updatedAt = new Date().toISOString();

    saveProfiles(profiles);

    res.json({ message: "Documents uploaded successfully! Your verification is pending." });
  }
);

module.exports = router;

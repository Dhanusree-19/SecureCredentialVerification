-- ============================================================
-- database.sql
-- Run this file in MySQL to create the database and tables.
--
-- HOW TO RUN:
-- Option 1 (MySQL command line):
--   mysql -u root -p < database.sql
--
-- Option 2 (MySQL Workbench):
--   Open MySQL Workbench → File → Run SQL Script → select this file
--
-- Option 3 (Copy paste):
--   Open MySQL Workbench or phpMyAdmin → paste all lines below → Execute
-- ============================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS faculty_db;

-- Use it
USE faculty_db;

-- ─── Users Table (faculty + admin accounts) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(20)  PRIMARY KEY,        -- timestamp-based ID e.g. "1710000000000"
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,    -- no duplicate emails
  password    VARCHAR(255) NOT NULL,           -- bcrypt hashed password
  role        ENUM('FACULTY', 'ADMIN') NOT NULL DEFAULT 'FACULTY',
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
);

-- ─── Profiles Table (faculty academic details + verification status) ──────────
CREATE TABLE IF NOT EXISTS profiles (
  user_id               VARCHAR(20)  PRIMARY KEY,  -- same as users.id
  name                  VARCHAR(100),
  email                 VARCHAR(100),
  phone                 VARCHAR(20),
  department            VARCHAR(100),
  designation           VARCHAR(100),
  university            VARCHAR(150),
  highest_qualification VARCHAR(100),
  university_name       VARCHAR(150),
  year_of_completion    VARCHAR(10),
  specialization        VARCHAR(150),
  status                ENUM('PENDING', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
  remarks               TEXT,
  degree_certificate    VARCHAR(255),   -- uploaded filename
  id_proof              VARCHAR(255),   -- uploaded filename
  experience_certificate VARCHAR(255),  -- uploaded filename
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

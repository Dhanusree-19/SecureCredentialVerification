# Secure Faculty Credential Verification System

A full-stack web app for verifying faculty credentials.
Built with Node.js + Express (backend) and plain HTML/CSS/JS (frontend).

---

## Folder Structure

```
SecureFacultyVerification/
│
├── backend/
│   ├── server.js               ← Main server file
│   ├── package.json            ← Dependencies list
│   ├── routes/
│   │   ├── auth.js             ← Register & Login routes
│   │   ├── profile.js          ← Profile save/get routes
│   │   ├── upload.js           ← File upload route
│   │   └── admin.js            ← Admin actions + email route
│   ├── data/
│   │   ├── users.json          ← All users stored here
│   │   └── profiles.json       ← All faculty profiles stored here
│   └── uploads/                ← Uploaded documents saved here
│
└── frontend/
    ├── style.css               ← Shared CSS for all pages
    ├── register.html           ← Faculty registration
    ├── login.html              ← Faculty login
    ├── university.html         ← Choose university
    ├── profile.html            ← Faculty profile form
    ├── upload.html             ← Document upload
    ├── status.html             ← Verification status
    ├── admin-register.html     ← Admin registration
    ├── admin-login.html        ← Admin login
    ├── admin-dashboard.html    ← Admin dashboard (faculty list)
    └── faculty-details.html    ← Admin view faculty + verify/reject
```

---

##  How to Run (Step by Step)

### Step 1 — Install Node.js
Download and install Node.js from: https://nodejs.org
Choose the LTS version. This also installs npm automatically.

To confirm installation, open a terminal/command prompt and type:
```
node -v
npm -v
```
Both should print a version number.

---

### Step 2 — Open the project folder
Open a terminal (Command Prompt or PowerShell on Windows, Terminal on Mac/Linux).

Navigate into the backend folder:
```
cd path/to/SecureFacultyVerification/backend
```

Example on Windows:
```
cd C:\Users\YourName\Desktop\SecureFacultyVerification\backend
```

---

### Step 3 — Install dependencies
Run this command (only needed once):
```
npm install
```
This will install: express, cors, multer, nodemailer, bcryptjs

---

### Step 4 — (Optional) Set up Email Notifications
Open the file: `backend/routes/admin.js`

Find these two lines and replace with your Gmail details:
```js
user: "your_email@gmail.com",       // ← Your Gmail address
pass: "your_app_password_here",     // ← Gmail App Password (NOT your real password)
```

Also update the `from:` field below it.

**How to get a Gmail App Password:**
1. Go to your Google Account → Security
2. Turn on 2-Step Verification (if not already on)
3. Go to Security → App Passwords
4. Create an app password for "Mail"
5. Copy the 16-character password and paste it above

> If you skip this step, the app still works — email just won't send (it logs the error and continues).

---

### Step 5 — Start the server
In the terminal (inside the backend folder), run:
```
node server.js
```

You should see:
```
Server running at http://localhost:3000
Open frontend: http://localhost:3000/register.html
```

---

### Step 6 — Open in Browser
Open your browser and go to:
```
http://localhost:3000/register.html
```

---

##  All Pages (URLs)

| Page                  | URL                                              |
|-----------------------|--------------------------------------------------|
| Faculty Register      | http://localhost:3000/register.html              |
| Faculty Login         | http://localhost:3000/login.html                 |
| Choose University     | http://localhost:3000/university.html            |
| Faculty Profile       | http://localhost:3000/profile.html               |
| Upload Documents      | http://localhost:3000/upload.html                |
| Verification Status   | http://localhost:3000/status.html                |
| Admin Register        | http://localhost:3000/admin-register.html        |
| Admin Login           | http://localhost:3000/admin-login.html           |
| Admin Dashboard       | http://localhost:3000/admin-dashboard.html       |
| Faculty Details       | http://localhost:3000/faculty-details.html       |

---

## API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | /api/register         | Faculty registration               |
| POST   | /api/login            | Faculty login                      |
| POST   | /api/admin/register   | Admin registration (role=ADMIN)    |
| POST   | /api/admin/login      | Admin login                        |
| POST   | /api/profile          | Save/update faculty profile        |
| GET    | /api/profile/:userId  | Get faculty profile by ID          |
| POST   | /api/upload           | Upload documents (multipart/form)  |
| GET    | /api/faculty-list     | Get all faculty (filter by ?university=) |
| GET    | /api/faculty/:userId  | Get single faculty details         |
| POST   | /api/verify           | Verify or reject faculty           |

---

## User Flow

### Faculty:
1. Register at `/register.html`
2. Login at `/login.html`
3. Choose university at `/university.html`
4. Fill profile at `/profile.html`
5. Upload documents at `/upload.html`
6. Check status at `/status.html`

### Admin:
1. Register at `/admin-register.html`
2. Login at `/admin-login.html`
3. View faculty list at `/admin-dashboard.html`
4. Click "View Details" to open `/faculty-details.html`
5. Verify or Reject faculty — email is sent automatically

---

## Common Issues & Fixes

| Problem                         | Fix                                                    |
|---------------------------------|--------------------------------------------------------|
| `npm install` fails             | Make sure you have internet and are inside `/backend`  |
| `node server.js` fails          | Make sure you ran `npm install` first                  |
| Page not loading                | Make sure server is running on port 3000               |
| File upload not working         | The `uploads/` folder is auto-created, no action needed|
| Email not sending               | Check your Gmail App Password in `admin.js`            |
| "Profile not found" on upload   | Complete the profile form first before uploading       |

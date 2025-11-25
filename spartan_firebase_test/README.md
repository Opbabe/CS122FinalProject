# Spartan Firebase Test / Student Task Management System (Backend Setup)

This repo demonstrates the backend setup for the **SpartanCalendar / Task Management System** project using **Firebase Firestore** as the database.  
It connects Python code to Firestore to create, read, update, and delete data that persists across sessions — even after closing VS Code.

---

## 🗂️ Folder Structure

spartan_firebase_test/
├── .venv/ # Virtual environment
├── .env # Environment variable for credentials
├── .gitignore # Ignore secrets and virtualenv
├── requirements.txt # Python dependencies
├── secrets/
│ └── serviceAccountKey.json # Firebase service account key (DO NOT COMMIT)
└── src/
├── db_test.py # Full CRUD test script
├── read_only.py # Read-only Firestore check


---

## 🧩 Requirements

- Python 3.10+
- Firebase project with Firestore enabled
- Service account JSON key file from Firebase console

---

## ⚙️ Step 1 — Clone and Setup Environment

Open VS Code and in the terminal:

```bash
# 1. Clone or create project folder
cd ~/Documents
mkdir spartan_firebase_test && cd spartan_firebase_test

# 2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate     # macOS / Linux
# .venv\Scripts\Activate.ps1  # Windows PowerShell

# 3. Install dependencies
pip install google-cloud-firestore python-dotenv
pip freeze > requirements.txt

## 🔐 Step 2 — Add Firebase Credentials

Go to your Firebase Console → Project Settings → Service Accounts

Click Generate New Private Key and download the JSON file

Move it to:
    secrets/serviceAccountKey.json

Create a .env file in the project root:
    GOOGLE_APPLICATION_CREDENTIALS=secrets/serviceAccountKey.json

## 🧠 Step 3 — Run the Firestore Connection Test 
Run:
    python src/db_test.py
You should see:
    All tasks:
    - Xiu14Tcbl8YCbcn1OvLb: Read Lecture Notes (open) due 2025-11-15T23:28:28+00:00
    ...
    ✅ CRUD test complete.
This means:

Firestore connected ✅

Data persisted in the cloud ✅

Check your Firebase Console → Firestore Database → Data → users/demoUser/tasks/...

## 🔍 Step 4 — Verify Data Persistence
After closing VS Code, re-open it and run:
    python src/read_only.py
Expected output:

    == Current tasks (sorted by dueAt) ==
    - Xiu14Tcbl8YCbcn1OvLb: Read Lecture Notes | done | due 2025-11-15 23:28:28+00:00
    Total: 1
Your data is still there — because Firestore stores it in the cloud.

SpartanCalendar Backend (Firestore + Python)
Overview

SpartanCalendar is a student-oriented Task Management System that uses:

- Firebase Firestore as the cloud database
- Python for backend testing, data modeling, and database validation
- React (separate folder) for the user interface

This backend is responsible for:

- Setting up and validating the Firestore database
- Modeling tasks using OOP principles
- Performing CRUD operations (create, read, update, delete)
- Seeding Firestore with demo data for frontend development
- Defining the Firestore schema that the React frontend relies on

Project Structure

The backend folder contains the following:

spartan_firebase_test/
│
├── .venv/                     # Python virtual environment (ignored by Git)
├── .env                       # Path to Firebase credentials
├── .gitignore                 # Ensures sensitive files stay out of GitHub
├── requirements.txt           # Python package list
│
├── secrets/
│   └── serviceAccountKey.json # Firebase admin key (DO NOT COMMIT)
│
└── src/
    ├── models.py              # Defines the Task object using OOP
    ├── repository.py          # Handles Firestore operations using OOP
    ├── db_test.py             # Main CRUD test script (uses Task + TaskRepository)
    ├── read_only.py           # Reads tasks from Firestore safely
    └── seed_demo.py           # Adds demo tasks for frontend testing


    What each file does

models.py

-   Introduces the OOP data model (Task)
-   Defines the fields each Task must contain
-   Ensures consistent structure across backend and frontend

repository.py

-   Provides a TaskRepository class for interacting with Firestore
-   Encapsulates CRUD logic: retrieving tasks, adding tasks, updating status, deleting tasks
-   Ensures all Firestore access is centralized and cleanly structured

db_test.py

-   Demonstrates full backend functionality
-   Creates tasks, reads them, updates them, and deletes them
-   Confirms the database connection and OOP structure work together

read_only.py

-   Reads Firestore data without making changes
-   Useful for verifying persistence and testing frontend sync
seed_demo.py

-   Populates Firestore with sample tasks
-   Helps the React developer test UI components without entering data manually

Environment & Setup

The backend uses:

-   A Python virtual environment (.venv)
-   A .env file that points to the Firebase service account JSON
-   A secrets/ folder that contains sensitive credentials
-   (these must never be committed to GitHub)

Installation steps:

-   Create the virtual environment

-   Install required libraries

-   Set up the .env file

-   Place the service account key in /secrets

-   Run the test scripts to confirm Firestore connection

Backend OOP Design

The backend uses object-oriented programming to provide a clean structure:

1. Task Class

- Represents an individual task as an object
- Contains all the fields the React frontend will need
- Ensures consistent data structure everywhere

2. TaskRepository Class

- Handles all communication with Firestore

- Responsible for:

    - Creating tasks
    - Reading tasks
    - Updating task fields (status, priority, etc.)
    - Deleting tasks

- Maintains clean separation between data model and database operations

Why OOP matters

- Easier to maintain and extend
- Provides a clear, consistent interface
- Ensures backend and frontend align through a shared data structure
- Makes the code much easier to explain in your project report

Firestore Database Schema

The following schema is the single source of truth for both backend and frontend.

Collections:
users/{uid}
  └── tasks/{taskId}
  
**Fields in each task document:**

title — task name

description — details

dueAt — due date and time

priority — 0 (low), 1 (medium), 2 (high)

status — "open", "in_progress", or "done"

courseId — e.g., "cs122"

courseName — e.g., "CS 122"

categoryId — e.g., "homework"

categoryName — human-readable value

tags — list of labels

createdAt — timestamp when the task was created

updatedAt — timestamp for last modification
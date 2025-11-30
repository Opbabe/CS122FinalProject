"""
Create demo data for Martin Sanchez
This script populates Firestore with sample tasks for Martin's courses
"""
from google.cloud import firestore
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime, timedelta, timezone

db = firestore.Client()
uid = "martinSanchez"  # User ID for Martin
user_ref = db.collection("users").document(uid)
tasks = user_ref.collection("tasks")

# Course information
courses = {
    "cs22b": {
        "id": "cs22b",
        "name": "CS 22B - Python Data Analysis",
        "section": "Section 02"
    },
    "cs122": {
        "id": "cs122",
        "name": "CS 122 - Adv Python Prog",
        "section": "Section 01"
    },
    "cs163": {
        "id": "cs163",
        "name": "CS 163 - Data Science Project",
        "section": "Section 01"
    },
    "cs171": {
        "id": "cs171",
        "name": "CS 171 - Intro Machine Learn",
        "section": "Section 01"
    },
    "kin35b": {
        "id": "kin35b",
        "name": "KIN 35B - Inter Wt Training",
        "section": "Section 02"
    },
    "ssci101": {
        "id": "ssci101",
        "name": "SSCI 101 - Leadership",
        "section": "Section 10"
    }
}

def create_task(title, course_key, days_ahead, priority, status, category, description=""):
    """Create a task in Firestore"""
    course = courses[course_key]
    due = datetime.now(timezone.utc) + timedelta(days=days_ahead)
    
    doc_ref = tasks.document()
    doc_ref.set({
        "title": title,
        "description": description,
        "dueAt": due,
        "priority": priority,  # 0=Low, 1=Medium, 2=High
        "status": status,  # open, in_progress, done
        "courseId": course["id"],
        "courseName": course["name"],
        "categoryId": category.lower().replace(" ", "_"),
        "categoryName": category,
        "tags": [course["id"], category.lower()],
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    })
    return doc_ref.id

def main():
    print("Creating demo tasks for Martin Sanchez...\n")
    
    # Clear existing tasks (optional - comment out if you want to keep existing)
    print("Clearing existing tasks...")
    existing = tasks.stream()
    for doc in existing:
        doc.reference.delete()
    print("✓ Cleared existing tasks\n")
    
    # CS 122 Tasks (Advanced Python Programming)
    print("Creating CS 122 tasks...")
    create_task(
        "CS 122 - Final Project Proposal",
        "cs122",
        days_ahead=5,
        priority=2,  # High
        status="in_progress",
        category="Project",
        description="Complete the final project proposal with all required sections including architecture, timeline, and deliverables"
    )
    create_task(
        "CS 122 - Complete Task Management System",
        "cs122",
        days_ahead=12,
        priority=2,  # High
        status="open",
        category="Project",
        description="Finish implementing the SpartanCalendar task management system with Firebase integration"
    )
    create_task(
        "CS 122 - Review Firebase Documentation",
        "cs122",
        days_ahead=2,
        priority=1,  # Medium
        status="open",
        category="Homework",
        description="Review Firestore security rules and best practices for the project"
    )
    
    # CS 22B Tasks (Python Data Analysis)
    print("Creating CS 22B tasks...")
    create_task(
        "CS 22B - Data Analysis Assignment 3",
        "cs22b",
        days_ahead=7,
        priority=1,  # Medium
        status="open",
        category="Homework",
        description="Complete pandas data analysis assignment on student performance dataset"
    )
    create_task(
        "CS 22B - Study for Midterm",
        "cs22b",
        days_ahead=10,
        priority=2,  # High
        status="open",
        category="Exam",
        description="Review numpy, pandas, matplotlib, and data cleaning concepts"
    )
    
    # CS 163 Tasks (Data Science Project)
    print("Creating CS 163 tasks...")
    create_task(
        "CS 163 - Data Science Project Quiz",
        "cs163",
        days_ahead=3,
        priority=2,  # High
        status="open",
        category="Exam",
        description="Publication & Interactive Visual Data Analysis Quiz - study visualization libraries"
    )
    create_task(
        "CS 163 - Project Milestone 2",
        "cs163",
        days_ahead=14,
        priority=2,  # High
        status="in_progress",
        category="Project",
        description="Complete interactive dashboard with D3.js or Plotly for data visualization"
    )
    
    # CS 171 Tasks (Intro Machine Learning)
    print("Creating CS 171 tasks...")
    create_task(
        "CS 171 - ML Assignment: Classification",
        "cs171",
        days_ahead=9,
        priority=1,  # Medium
        status="open",
        category="Homework",
        description="Implement and compare different classification algorithms (k-NN, SVM, Decision Trees)"
    )
    create_task(
        "CS 171 - Review Neural Networks",
        "cs171",
        days_ahead=6,
        priority=1,  # Medium
        status="open",
        category="Homework",
        description="Study backpropagation and neural network architectures"
    )
    
    # KIN 35B Tasks (Intermediate Weight Training)
    print("Creating KIN 35B tasks...")
    create_task(
        "KIN 35B - Workout Log Submission",
        "kin35b",
        days_ahead=4,
        priority=0,  # Low
        status="open",
        category="Homework",
        description="Submit weekly workout log with exercises and progress notes"
    )
    
    # SSCI 101 Tasks (Leadership)
    print("Creating SSCI 101 tasks...")
    create_task(
        "SSCI 101 - Leadership Reflection Paper",
        "ssci101",
        days_ahead=11,
        priority=1,  # Medium
        status="open",
        category="Project",
        description="Write 3-page reflection on leadership styles and personal development"
    )
    create_task(
        "SSCI 101 - Group Project Meeting",
        "ssci101",
        days_ahead=8,
        priority=1,  # Medium
        status="open",
        category="Club",
        description="Meet with team to discuss leadership case study presentation"
    )
    
    # Some completed tasks for better demo
    print("Creating completed tasks...")
    create_task(
        "CS 122 - Firebase Setup Complete",
        "cs122",
        days_ahead=-5,  # 5 days ago
        priority=2,
        status="done",
        category="Project",
        description="Successfully set up Firebase project and Firestore database"
    )
    create_task(
        "CS 163 - Data Collection Phase",
        "cs163",
        days_ahead=-3,  # 3 days ago
        priority=1,
        status="done",
        category="Project",
        description="Completed data collection and initial cleaning for project"
    )
    
    print("\n✅ Demo data creation complete!")
    print(f"\nTotal tasks created: {len(list(tasks.stream()))}")
    print("\nYou can now view these tasks in the React frontend dashboard!")

if __name__ == "__main__":
    main()


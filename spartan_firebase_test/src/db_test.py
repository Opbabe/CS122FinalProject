from google.cloud import firestore
from dotenv import load_dotenv
load_dotenv()   # this must run BEFORE firestore.Client()
from datetime import datetime, timedelta, timezone

db = firestore.Client()
uid = "demoUser"
user_ref = db.collection("users").document(uid)
tasks = user_ref.collection("tasks")

def create_task(title, days_ahead=3, priority=1, status="open"):
    due = datetime.now(timezone.utc) + timedelta(days=days_ahead)
    doc_ref = tasks.document()  # auto-id
    doc_ref.set({
        "title": title,
        "description": f"Auto-created at {datetime.now().isoformat()}",
        "dueAt": due,
        "priority": priority,                 # 0/1/2
        "status": status,                     # open|in_progress|done
        "courseId": "cs122", "courseName": "CS 122",
        "categoryId": "homework", "categoryName": "Homework",
        "tags": ["demo"],
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    })
    return doc_ref.id

def read_all_tasks():
    print("\nAll tasks:")
    for d in tasks.stream():
        t = d.to_dict()
        print(f"- {d.id}: {t['title']} ({t['status']}) due {t['dueAt']}")

def update_task(doc_id, **patch):
    patch["updatedAt"] = firestore.SERVER_TIMESTAMP
    tasks.document(doc_id).update(patch)

def delete_task(doc_id):
    tasks.document(doc_id).delete()

if __name__ == "__main__":
    # CREATE
    a = create_task("Read Lecture Notes", days_ahead=1, priority=1)
    b = create_task("Problem Set 3", days_ahead=3, priority=2)

    # READ
    read_all_tasks()

    # UPDATE (mark first task done)
    update_task(a, status="done")

    # READ again
    read_all_tasks()

    # DELETE (remove the second task)
    delete_task(b)
    print("\nDeleted one task.")

    # READ final
    read_all_tasks()
    print("\n✅ CRUD test complete.")

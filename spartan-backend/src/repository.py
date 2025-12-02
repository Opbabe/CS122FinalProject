from google.cloud import firestore
from datetime import timezone
from typing import List
from models import Task

class TaskRepository:
    def __init__(self, uid: str):
        # manages CRUD operations for a user's tasks in Firestore.
        """Creates references:
        - users/{uid}
        - users/{uid}/tasks
        """
        self.db =firestore.Client()
        self.user_ref=self.db.collection("users").document(uid)
        self.tasks_ref = self.user_ref.collection("tasks")

    def create(self, task: Task) -> str:
        #Insert a new Task document into Firestore and return its ID.
        doc_ref =self.tasks_ref.document()
        doc_ref.set(task.to_firestore())
        return doc_ref.id

    def get_all(self) -> List[Task]:
        #Read all tasks sorted by dueAt, convert them back into Task objects,
        #and return the list.
        snap=self.tasks_ref.order_by("dueAt").stream()
        result= []
        for doc in snap:
            d = doc.to_dict()  # Firestore dict to Python dict
            result.append(Task(
                id=doc.id,
                title=d["title"],
                description=d.get("description", ""),
                due_at=d["dueAt"],
                priority=d["priority"],
                status=d["status"],
                course_id=d.get("courseId", ""),
                course_name=d.get("courseName", ""),
                category_id=d.get("categoryId", ""),
                category_name=d.get("categoryName", ""),
                tags=d.get("tags", []),
            ))
        return result
    def update_status(self, doc_id: str, new_status: str):
        #Update only the 'status' field of a task.
        #Firestore handles timestamp generation via SERVER_TIMESTAMP.
        self.tasks_ref.document(doc_id).update({
            "status": new_status,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })
    def delete(self, doc_id: str):
        #Delete a task document by Firestore ID.
        self.tasks_ref.document(doc_id).delete()
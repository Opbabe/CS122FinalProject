from google.cloud import firestore
from datetime import timezone
from typing import List
from .models import Task

class TaskRepository:
    def __init__(self, uid: str):
        self.db = firestore.Client()
        self.user_ref = self.db.collection("users").document(uid)
        self.tasks_ref = self.user_ref.collection("tasks")

    def create(self, task: Task) -> str:
        doc_ref = self.tasks_ref.document()
        doc_ref.set(task.to_firestore())
        return doc_ref.id

    def get_all(self) -> List[Task]:
        snap = self.tasks_ref.order_by("dueAt").stream()
        result = []
        for doc in snap:
            d = doc.to_dict()
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
        self.tasks_ref.document(doc_id).update({
            "status": new_status,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })

    def delete(self, doc_id: str):
        self.tasks_ref.document(doc_id).delete()

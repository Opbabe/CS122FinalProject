from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import List, Optional

@dataclass
class Task:
    id: Optional[str]          # Firestore doc id, None when new
    title: str
    description: str
    due_at: datetime
    priority: int              # 0/1/2
    status: str                # "open" | "in_progress" | "done"
    course_id: str = "cs122"
    course_name: str = "CS 122"
    category_id: str = "homework"
    category_name: str = "Homework"
    tags: List[str] = None

    def to_firestore(self):
        data = asdict(self)
        data["dueAt"] = self.due_at
        data["createdAt"] = datetime.now(timezone.utc)
        data["updatedAt"] = datetime.now(timezone.utc)
        # Remove local-only convenience fields if needed
        data.pop("id", None)
        data.pop("due_at", None)
        return data

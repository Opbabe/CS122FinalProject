from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timedelta, timezone
from models import Task
from repository import TaskRepository

if __name__ == "__main__":
    repo = TaskRepository(uid="demoUser")

    # CREATE
    now = datetime.now(timezone.utc)
    t1 = Task(
        id=None,
        title="Read Lecture Notes",
        description="DP intro",
        due_at=now + timedelta(days=1),
        priority=1,
        status="open",
        tags=["demo", "reading"]
    )
    t2 = Task(
        id=None,
        title="Problem Set 3",
        description="Ch.5 recursion",
        due_at=now + timedelta(days=3),
        priority=2,
        status="open",
        tags=["demo", "ps"]
    )

    id1 = repo.create(t1)
    id2 = repo.create(t2)

    # READ
    print("\nAll tasks:")
    for t in repo.get_all():
        print(f"- {t.id}: {t.title} ({t.status}) due {t.due_at}")

    # UPDATE
    repo.update_status(id1, "done")

    print("\nAfter update:")
    for t in repo.get_all():
        print(f"- {t.id}: {t.title} ({t.status}) due {t.due_at}")

    # DELETE
    repo.delete(id2)
    print("\nDeleted one task.")

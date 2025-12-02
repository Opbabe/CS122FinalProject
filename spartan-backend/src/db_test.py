# import some utils such as datetime and the Task class from model.py
from datetime import datetime, timedelta, timezone
from models import Task

# Import the TaskRepository class 
from repository import TaskRepository

if __name__ == "__main__":#CRUD
    repo = TaskRepository(uid="demoUser")# create a repository instance for a demo user
    now = datetime.now(timezone.utc)# Current timestamp in UTC
    #--- CREATE------
    # make some sample tasks for testing Firestore writes
    t1 = Task(
        id=None, # Firestore will assign an ID
        title="Read Lecture Notes", # Task title
        description="DP intro", # description
        due_at=now + timedelta(days=1), # due tomorrow
        priority=1,  # User-defined priority scale
        status="open",  # Start as open
        tags=["demo", "reading"], # Label for filtering
    )
    t2 = Task(
        id=None,
        title="Problem Set 3",
        description="Ch.5 recursion",
        due_at=now + timedelta(days=3), # Due in 3 days
        priority=2,
        status="open",
        tags=["demo", "ps"],
    )
    # Persist tasks into Firestore
    id1 = repo.create(t1)
    id2 = repo.create(t2)
    #---READ---
    # read all tasks currently stored
    print("\nAll tasks:")
    for t in repo.get_all():
        print(f"- {t.id}: {t.title} ({t.status}) due {t.due_at}")
    #---UPDATE---   
    # update one task's status field
    repo.update_status(id1, "done")

    print("\nAfter update:")
    for t in repo.get_all():
        print(f"- {t.id}: {t.title} ({t.status}) due {t.due_at}")
    #---DELETE---
    #delete  a task by ID
    repo.delete(id2)
    print("\nDeleted one task.")
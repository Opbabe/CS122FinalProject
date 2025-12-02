# src/read_only.py
from dotenv import load_dotenv
load_dotenv()

from google.cloud import firestore

db = firestore.Client()
uid = "demoUser"
tasks = db.collection("users").document(uid).collection("tasks")

print("\n== Current tasks (sorted by dueAt) ==")
snap = tasks.order_by("dueAt").stream()
count = 0
for d in snap:
    t = d.to_dict()
    print(f"- {d.id}: {t.get('title')} | {t.get('status')} | due {t.get('dueAt')}")
    count += 1
print(f"\nTotal: {count}")

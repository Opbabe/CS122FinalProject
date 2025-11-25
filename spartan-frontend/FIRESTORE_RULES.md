# Firestore Security Rules

## Current Database Structure
```
users/
  └── martinSanchez/
      └── tasks/
          └── {taskId}/
```

## Development Rules (Copy this to Firebase Console → Firestore → Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      // Allow read/write for martinSanchez user (demo)
      allow read, write: if userId == "martinSanchez";
    }
    // Allow access to user documents
    match /users/{userId} {
      allow read, write: if userId == "martinSanchez";
    }
  }
}
```

## Quick Test Rules (Temporary - Development Only)

If you need to test quickly, you can use these permissive rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `spartan-calendar-122`
3. Click **Firestore Database** → **Rules** tab
4. Paste one of the rule sets above
5. Click **Publish**
6. Wait a few seconds for rules to update
7. Refresh your React app


# Firebase Setup Guide for SpartanCalendar

This guide will help you connect the React frontend to your Firebase Firestore database.

## Step 1: Get Firebase Web App Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview" → **Project Settings**
4. Scroll down to **"Your apps"** section
5. Click the **Web icon** (`</>`) to add a web app (if you haven't already)
6. Register your app with a nickname (e.g., "SpartanCalendar Web")
7. Copy the `firebaseConfig` object that appears

## Step 2: Configure Firebase in the Frontend

### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in the `spartan-frontend` directory:
   ```bash
   cd spartan-frontend
   touch .env
   ```

2. Add your Firebase config to `.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key-here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

3. Replace the placeholder values with your actual Firebase config values

### Option B: Direct Configuration

Edit `src/firebase/config.js` and replace the placeholder values in `firebaseConfig` with your actual Firebase configuration.

## Step 3: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Update the rules to allow read/write for the demo (for development only):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/tasks/{taskId} {
         allow read, write: if request.auth != null || userId == "martinSanchez";
       }
     }
   }
   ```
   
   **Note:** For production, implement proper authentication and security rules.

## Step 4: Create Demo Data for Martin Sanchez

1. Make sure your Python backend is set up (see `spartan_firebase_test/README.md`)
2. Run the demo data creation script:
   ```bash
   cd spartan_firebase_test
   source .venv/bin/activate  # or .venv\Scripts\Activate.ps1 on Windows
   python src/create_martin_demo.py
   ```

This will create sample tasks for Martin's courses:
- CS 22B - Python Data Analysis
- CS 122 - Adv Python Prog
- CS 163 - Data Science Project
- CS 171 - Intro Machine Learn
- KIN 35B - Inter Wt Training
- SSCI 101 - Leadership

## Step 5: Start the Frontend

```bash
cd spartan-frontend
npm start
```

The app should now connect to Firestore and display real data!

## Troubleshooting

### "Failed to load tasks" Error

1. **Check Firebase Config**: Make sure your Firebase config values are correct in `.env` or `config.js`
2. **Check Firestore Rules**: Ensure your security rules allow read/write access
3. **Check Network**: Open browser DevTools → Network tab to see if requests are being made
4. **Check Console**: Look for specific error messages in the browser console

### "Permission Denied" Error

- Update your Firestore security rules (see Step 3)
- Make sure the user ID matches: `martinSanchez`

### Tasks Not Appearing

- Run the demo data script: `python src/create_martin_demo.py`
- Check Firestore Console to verify tasks exist in `users/martinSanchez/tasks`
- Refresh the React app

## Data Structure

Tasks are stored in Firestore with this structure:
```
users/
  └── martinSanchez/
      └── tasks/
          └── {taskId}/
              ├── title: string
              ├── description: string
              ├── dueAt: timestamp
              ├── priority: number (0=Low, 1=Medium, 2=High)
              ├── status: string (open, in_progress, done)
              ├── courseId: string
              ├── courseName: string
              ├── categoryId: string
              ├── categoryName: string
              ├── tags: array
              ├── createdAt: timestamp
              └── updatedAt: timestamp
```

## Next Steps

- Implement Firebase Authentication for real user login
- Add real-time updates using Firestore listeners
- Add task editing and deletion functionality
- Implement reminders and notifications


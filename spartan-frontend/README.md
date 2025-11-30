# SpartanCalendar

A modern academic task and event management system built for SJSU students.

## Features

- 📊 **Dashboard** - Overview of all tasks with stats and filtering
- ➕ **Task Management** - Create, update, and delete academic tasks
- 📅 **Event Calendar** - Schedule events, meetings, and holidays
- 📈 **Reports & Analytics** - Track progress and performance
- 🎓 **Class Schedule** - View your class calendar
- 💾 **Firebase Integration** - Real-time cloud storage

## Tech Stack

- **Frontend**: React, CSS3
- **Backend**: Firebase Firestore
- **Styling**: Custom CSS with SJSU brand colors

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Firebase project (see setup below)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Firebase Setup

1. Create a `.env` file in the root directory:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

2. Enable Firestore in Firebase Console
3. Set security rules (see `FIRESTORE_RULES.md`)

See `FIREBASE_SETUP.md` for detailed instructions.

## Project Structure

```
spartan-frontend/
├── src/
│   ├── components/     # React components
│   ├── firebase/       # Firebase configuration
│   ├── services/       # Firestore service layer
│   └── App.js          # Main app component
├── public/             # Static assets
└── .env                # Environment variables (not in git)
```

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Development

Built with React hooks and modern JavaScript. All data is stored in Firebase Firestore with real-time synchronization.

For more details, see the documentation files in the root directory.

---

**CS 122 Final Project** · Martin & Nick

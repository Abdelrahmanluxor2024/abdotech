// ==================== FIREBASE CONFIGURATION ====================
// Firebase Web SDK (Compat version for broad compatibility & offline/file:// support)

const firebaseConfig = {
  apiKey: "AIzaSyD_orcnGOH8XS6zY5Ii5379owwYZDZ8Yh4",
  authDomain: "me-web-f4e3a.firebaseapp.com",
  projectId: "me-web-f4e3a",
  storageBucket: "me-web-f4e3a.firebasestorage.app",
  messagingSenderId: "134789019215",
  appId: "1:134789019215:web:f6c92ddc53f3388dd99c3a",
  measurementId: "G-87VNMQY1B6"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Import specific modules from Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { onMessage } from 'firebase/messaging';
import { getMessaging } from 'firebase/messaging/sw';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Pp8bt8ASUbf0EVJ4iVhXpymI-dxVIQc",
  authDomain: "smartdoorbell-49fd1.firebaseapp.com",
  databaseURL: "https://smartdoorbell-49fd1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartdoorbell-49fd1",
  storageBucket: "smartdoorbell-49fd1.firebasestorage.app",
  messagingSenderId: "163361561997",
  appId: "1:163361561997:web:3d248b9e5380ac0cfff1c4"
};

// Initialize Firebase using the modular approach
const app = initializeApp(firebaseConfig);

// Get Firebase Database instance
const database = getDatabase(app);

// Initialize Firebase Messaging using the modular SDK
let messaging:any;
if (typeof window !== "undefined") {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.log('Service Worker registration failed:', err);
      });
  }

  // Initialize Firebase Messaging
  messaging = getMessaging(app);

  // Handle foreground messages
  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    // Handle foreground notification here (you can display a notification or handle the data)
  });
}

export { database, messaging };

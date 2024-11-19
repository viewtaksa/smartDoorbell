// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
// import { getMessaging } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js';
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC0Pp8bt8ASUbf0EVJ4iVhXpymI-dxVIQc",
  authDomain: "smartdoorbell-49fd1.firebaseapp.com",
  databaseURL: "https://smartdoorbell-49fd1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartdoorbell-49fd1",
  storageBucket: "smartdoorbell-49fd1.firebasestorage.app",
  messagingSenderId: "163361561997",
  appId: "1:163361561997:web:3d248b9e5380ac0cfff1c4"
});

const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.title,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

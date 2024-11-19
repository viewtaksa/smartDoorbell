"use client";
import { useEffect, useState } from "react";
import { database } from "../firebaseConfig"; // นำเข้าการตั้งค่า firebase
import { ref, set, onValue } from "firebase/database"; // นำเข้า Firebase SDK สำหรับ Realtime Database
import { messaging } from "../firebaseConfig"; // นำเข้าการตั้งค่า Firebase Messaging
import { getToken, onMessage } from "firebase/messaging"; // ฟังก์ชันที่ใช้ในการรับ token และการรับการแจ้งเตือน

const DoorBellSection = () => {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [lockStatus, setLockStatus] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");
  const vapidId = "BKc2uSJZG-784Zf6M8rf_n4cBHTFHkmL1O9lwYU7PKjq546cs8-mqtL88Lutp102KdCLe9cVrwNfOUbIYyt0tDc";

  const getNotificationPermission = async () => {
    try {
      if (Notification.permission === "granted") {
        const currentToken = await getToken(messaging, { vapidKey: vapidId });
        if (currentToken) {
          setFcmToken(currentToken);
          console.log("FCM Token:", currentToken);
        } else {
          console.log("No registration token available.");
        }
      } else if (Notification.permission === "denied") {
        alert("Please enable notifications in your browser settings.");
      } else {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messaging, { vapidKey: vapidId });
          if (currentToken) {
            setFcmToken(currentToken);
            console.log("FCM Token:", currentToken);
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.log("Permission not granted for notifications.");
        }
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received.", payload);
      setNotification(payload.notification?.body || "No notification message");
    });
  }, []);

  useEffect(() => {
    const notificationRef = ref(database, "/notification");
    const lockStatusRef = ref(database, "/lockStatus");
    const photoUrlRef = ref(database, "/photoUrl");

    const unsubscribeNotification = onValue(notificationRef, (snapshot) => {
      const notificationValue = snapshot.val();
      setNotification(notificationValue);
      console.log("Notification:", notificationValue);
    });

    const unsubscribeLockStatus = onValue(lockStatusRef, (snapshot) => {
      const lockStatusValue = snapshot.val();
      setLockStatus(lockStatusValue);
      console.log("Lock Status:", lockStatusValue);
    });

    const unsubscribePhotoUrl = onValue(photoUrlRef, (snapshot) => {
      const photoUrlValue = snapshot.val();
      setPhotoUrl(photoUrlValue);
      console.log("Photo URL:", photoUrlValue);
    });

    return () => {
      unsubscribeNotification();
      unsubscribeLockStatus();
      unsubscribePhotoUrl();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
    
  }, []);
  

  const takePhoto = () => {
    const randomNum = Math.floor(Math.random() * 50000);
    const photoUrl = `http://localhost:3000/capture?_cb=${randomNum}`;
    const photoUrlRef = ref(database, "/photoUrl");
    set(photoUrlRef, photoUrl);
    setPhotoUrl(photoUrl);
  };

  const handleUnlock = () => {
    setLockStatus("UNLOCKED");
    const lockStatusRef = ref(database, "/lockStatus");
    set(lockStatusRef, "UNLOCKED");

    setTimeout(() => {
      setLockStatus("LOCKED");
      set(lockStatusRef, "LOCKED");
    }, 3000);
  };

  const sendNotification = () => {
    const notificationRef = ref(database, "/notification");
    set(notificationRef, "Someone Arrived");
  
    if (fcmToken) {
      fetch("https://fcm.googleapis.com/v1/projects/smartdoorbell-49fd1/messages:send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ya29.a0AeDClZAJHDSXNgGFFGrhwTGZr-ccGQKctqEC2k2A34YGx2vpLsdS7dbIFqVi3SP3ycByO7O9p5amJ6hLdCidOz7GczKIqdUmLASsnfU2Fgof9dKssJccRjmA6SCZCkGtnfDZn8uPa-QEWtue7ulVHlWvvi5HXysQ2JdNEocaaCgYKAXoSARESFQHGX2MiykOBBWsI0FcjoU_xkm9r7Q0175", // ใช้ server key ที่ได้จาก Firebase Console
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            notification: {
              title: "Door is Belling",
              body: "Someone is at the door!!!!",
            },
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log("FCM Notification sent", data))
        .catch((error) => console.error("Error sending FCM notification", error));
    }
  };
  

  useEffect(() => {
    getNotificationPermission();
  }, []);

  return (
    <div className="container mx-auto">
      <h1>Realtime Firebase with Next.js</h1>
      <div className="flex gap-4">
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={takePhoto}
        >
          Take Photo
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={sendNotification}
        >
          Send Notification
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={handleUnlock}
        >
          Unlock
        </button>
      </div>

      {photoUrl && (
        <div>
          <h2>Photo URL</h2>
          <img src={photoUrl} alt="Captured Photo" />
        </div>
      )}

      <div>
        <h2>Lock Status: {lockStatus}</h2>
      </div>
      <div>
        <h2>Notification: {notification}</h2>
      </div>
      <div>
        <h2>token = {fcmToken}</h2>
      </div>
    </div>
  );
};

export default DoorBellSection;

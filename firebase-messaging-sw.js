importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// 🔹 عبي بياناتك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBPD5LOAykxUvPHJfnlAi_ycCPr6PxhtCI",
  authDomain: "website-akkar.firebaseapp.com",
  projectId: "website-akkar",
  storageBucket: "website-akkar.firebasestorage.app",
  messagingSenderId: "324056566339",
  appId: "1:324056566339:web:4e192375500325532062f6",
  measurementId: "G-TWL33PZM80"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// استقبال إشعارات بالخلفية
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] رسالة بالخلفية:", payload);

  const notificationTitle = payload.notification?.title || "إشعار جديد";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo192.png", // غيرها لشعارك
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// فتح الرابط عند الضغط على الإشعار
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

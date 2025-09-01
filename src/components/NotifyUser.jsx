import { useEffect } from "react";
import { messaging, db } from "./firebase-config";
import { getToken, onMessage } from "firebase/messaging";
import { addDoc, collection } from "firebase/firestore";

function NotifyUser() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // جلب التوكن
          const token = await getToken(messaging, {
            vapidKey: "BDjHng5_4VQuKzBUvapC6jY2j-hgLjQA6Knla18jBeCnq5q3oNfkVczIFMPA_XKs33qJsIwvVP2hVykShOGo1I8"
          });

          if (token) {
            console.log("FCM Token:", token);

            // خزّنه بالـ Firestore
            await addDoc(collection(db, "tokens"), {
              token,
              createdAt: new Date()
            });

            new Notification("شكراً للاشتراك!", {
              body: "الآن ستصلك إشعارات الموقع."
            });
          }
        }
      } catch (err) {
        console.error("Permission error:", err);
      }
    };

    requestPermission();

    // استقبال الإشعارات وقت الصفحة مفتوحة
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      if (payload?.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body
        });
      }
    });
  }, []);

  return null;
}

export default NotifyUser;


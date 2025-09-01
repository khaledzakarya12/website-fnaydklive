import { useEffect } from "react";
import {db,messaging} from "../../utils/firebaseconfig";
import { getToken, onMessage } from "firebase/messaging";
import { addDoc, collection } from "firebase/firestore";

function NotifyUser() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // جلب التوكن مع الـ Public VAPID key
          const token = await getToken(messaging, {
            vapidKey: "BMgRP4CegxPcLakNbelhitwdwcOGhQWe_33AQUGTnmHGGkmseHKWxvJwWzIzLhXmtZOeOlqAeV3jMIhLJxyzsqs"
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

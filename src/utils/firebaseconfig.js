
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";  // ✅ استدعاء ref
import { getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBPD5LOAykxUvPHJfnlAi_ycCPr6PxhtCI",
  authDomain: "website-akkar.firebaseapp.com",
  projectId: "website-akkar",
  storageBucket: "website-akkar.firebasestorage.app",
  messagingSenderId: "324056566339",
  appId: "1:324056566339:web:4e192375500325532062f6",
  measurementId: "G-TWL33PZM80"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
const testRef = ref(storage, "test.txt");  // ✅ المرجع التجريبي
console.log("Storage initialized ✅", testRef);

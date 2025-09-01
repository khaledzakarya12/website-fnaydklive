import {auth ,db} from "./firebaseconfig"
import {
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ترجمة أخطاء Firebase إلى رسائل مفهومة
export function getFrontendErrorMessage(errorCode) {
  switch (errorCode) {
    case "Firebase: Error (auth/user-not-found).":
      return "This email is not registered, please make sure you enter a registered email.";
    case "Firebase: Error (auth/wrong-password).":
      return "The password entered is wrong. Please make sure you enter the correct password.";
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      return "The password should be at least 6 characters.";
    case "Firebase: Error (auth/email-already-in-use).":
      return "The email address is already in use. Please use a different email.";
    case "Firebase: Error (auth/invalid-email).":
      return "Invalid email address. Please enter a valid email.";
    case "Firebase: Error (auth/weak-password).":
      return "Weak password. Please choose a stronger password.";
    case "Firebase: Error (auth/operation-not-allowed).":
      return "This operation is currently not allowed. Please try again later.";
    case "Firebase: Error (auth/too-many-requests).":
      return "Too many requests, please try again in some minutes";
    default:
      return "An error occurred. Please try again.";
  }
}

// تسجيل مستخدم جديد
export const registerUser = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: user.email,
      role: "user", // أو "user" حسب الحاجة
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: getFrontendErrorMessage(error.message) };
  }
};

// تسجيل دخول مستخدم
export const signInUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: getFrontendErrorMessage(error.message) };
  }
};

// تسجيل الخروج
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// جلب بيانات المستخدم
export const fetchUserData = async (user) => {
  try {
    if (!user?.uid) {
      return { success: false, error: "User ID is missing" };
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: docSnap.data() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
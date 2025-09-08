import { useEffect } from "react";
import { db, messaging } from "../../utils/firebaseconfig";
import { getToken, onMessage } from "firebase/messaging";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotifyUser() {

  return <ToastContainer />;
}

export default NotifyUser;

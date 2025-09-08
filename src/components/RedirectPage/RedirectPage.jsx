import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";

export default function RedirectPage() {
  const { shortId } = useParams();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const q = query(collection(db, "short-links"), where("shortId", "==", shortId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const longUrl = snapshot.docs[0].data().longUrl;
          window.location.replace(longUrl); // فتح الرابط الطويل فوراً
        } else {
          setNotFound(true); // الرابط غير موجود
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    };

    fetchAndRedirect();
  }, [shortId]);

  if (notFound) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>الرابط غير موجود 😕</h2>
        <p>الرجاء التحقق من الرابط أو العودة إلى <Link to="/">الصفحة الرئيسية</Link>.</p>
      </div>
    );
  }

  return null; // لا شيء يظهر أثناء التحويل
}

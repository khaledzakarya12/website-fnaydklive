import { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { motion } from "framer-motion";
import { MainContext } from "../../utils/context";
import { FaFire, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom"; // 👈 ضيف هيدا

function Breaking() {
  const [breakingNews, setBreakingNews] = useState([]);
  const { userData } = useContext(MainContext);
const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    const q = query(collection(db, "all-news"), where("category", "==", "breaking"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBreakingNews(news);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("هل تريد حذف هذا الخبر العاجل؟")) {
      await deleteDoc(doc(db, "all-news", id));
    }
  };

  return (
    <div className="breaking-container">
      <h2 className="breaking-title">
        <FaFire className="breaking-icon" /> الأخبار العاجلة
      </h2>

      {breakingNews.length === 0 ? (
        <p className="no-news">لا يوجد أخبار عاجلة حالياً</p>
      ) : (
        breakingNews.map((item) => (
          <motion.div
            key={item.id}
            className="breaking-item"
             initial={isMobile ? { opacity: 0, y: -50 } : { opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 👇 بدل p بـ Link */}
            <Link to={`/news/${item.id}`} className="breaking-text">
              {item.title}
            </Link>

            {userData?.role === "admin" && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                <FaTrash />
              </button>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}

export default Breaking;

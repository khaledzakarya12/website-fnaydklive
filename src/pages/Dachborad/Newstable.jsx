import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";

export default function NewsTable() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const newsCol = collection(db, "news");
      const newsSnapshot = await getDocs(newsCol);
      const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(newsData);
    } catch (error) {
      alert("حدث خطأ أثناء جلب الأخبار: " + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الخبر؟")) {
      try {
        await deleteDoc(doc(db, "news", id));
        fetchNews();
      } catch (error) {
        alert("حدث خطأ أثناء الحذف: " + error.message);
      }
    }
  };

  if (loading) return <p style={{ color: "#fff", textAlign: "center" }}>جاري التحميل...</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>جدول الأخبار</h2>
      <table className="table">
        <thead>
          <tr>
            <th>الخيارات</th>
            <th>الحالة</th>
            <th>التاريخ</th>
            <th>العنوان</th>
          </tr>
        </thead>
        <tbody>
          {newsList.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>لا توجد أخبار حالياً</td>
            </tr>
          ) : (
            newsList.map(news => (
              <tr key={news.id}>
                <td>
                  <button className="btn2" onClick={() => handleDelete(news.id)}>حذف</button>
                </td>
                <td>{news.published ? "منشور" : "مسودة"}</td>
                <td>{new Date(news.date).toLocaleDateString()}</td>
                <td>{news.title}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

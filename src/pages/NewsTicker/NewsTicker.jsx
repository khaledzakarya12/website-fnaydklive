import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { Link } from "react-router-dom";

export default function NewsSlider() {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(db, "all-news"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);

        // فلتر: خد فقط العناصر اللي عندها صورة
        const newsList = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || "",
              imageUrl:
                data.images && data.images.length > 0
                  ? data.images[0]
                  : data.imageUrl || null,
              isVideo: data.isVideo || false, // إذا عندك حقل يحدد الفيديو
            };
          })
          .filter((item) => item.imageUrl && !item.isVideo); // فقط الصور

        setNews(newsList);
      } catch (error) {
        console.error("خطأ في جلب الأخبار:", error);
      }
    };

    fetchNews();
  }, []);

  // تغيير تلقائي
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return <span className="tail"></span>;

  return (
    <div className="news-slider">
      {news.map((item, index) => (
        <Link
          key={item.id}
          to={`/news/${item.id}`}
          className={`slide ${index === currentIndex ? "active" : ""}`}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="slide-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x300";
            }}
          />
          <h3 className="slide-title">{item.title}</h3>
        </Link>
      ))}
    </div>
  );
}


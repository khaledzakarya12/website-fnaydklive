import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db, auth } from "../../utils/firebaseconfig";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import LazyLoad from "react-lazyload";
import Miscellaneous from "../miscellaneous";

export default function NewsList({ category = null }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState({
    local: 6,
    international: 6,
    sports: 6,
    educational: 6,
  });

  const categoryLabels = {
    international: "إقليمي ودولي",
    sports: "رياضة",
    educational: "تربوي",
    local: "المحلية",
    breaking: "أخبار عاجلة",
    miscellaneous: "متفرقات",
    advertisement: "إعلانات",
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let q;
        if (category) {
          q = query(
            collection(db, "all-news"),
            where("category", "==", category),
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(collection(db, "all-news"), orderBy("createdAt", "desc"));
        }
        const querySnapshot = await getDocs(q);
        const newsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNews(newsData);
      } catch (error) {
        console.error("خطأ في جلب الأخبار:", error);
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  if (loading)
    return (
      <p className="tail">
        <TailSpin height="40" width="40" color="#db0808" ariaLabel="tail-spin-loading" radius="1" visible={true} />
      </p>
    );

  const filterByCategory = (cat) => news.filter((n) => n.category === cat);

  const showMore = (cat) => {
    setVisibleCounts((prev) => ({ ...prev, [cat]: prev[cat] + 6 }));
  };

  const renderNewsSection = (newsArray, label, cat) => {
    const visibleNews = newsArray.slice(0, visibleCounts[cat] || 6);

    return (
      <div className="news-section">
     
        <h2 className="section-title"><span className="span">|</span> {label}</h2>
        <AnimatePresence>
          {visibleNews.length === 0 ? (
            <p>لا توجد أخبار حالياً</p>
          ) : (
            <motion.div
              className="cards-grid"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
            >
              {visibleNews.map((item) => (
                <motion.div
                  key={item.id}
                  className="news-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {item.video ? (
                    <div className="news-video-wrapper">
                      <LazyLoad height={210} offset={100} placeholder={<div style={{background:'#333',height:'210px',borderRadius:'8px'}}/>}>
                        <video className="news-video" autoPlay loop muted playsInline>
                          <source src={item.video} type="video/mp4" />
                          متصفحك لا يدعم عرض الفيديو
                        </video>
                      </LazyLoad>
                    </div>
                  ) : (item.images && item.images.length > 0 ? item.images[0] : item.imageUrl) ? (
                    <LazyLoad height={210} offset={100} placeholder={<div style={{background:'#333',height:'210px',borderRadius:'8px'}}/>}>
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0] : item.imageUrl}
                        alt={item.title}
                        className="news-img"
                        style={{ filter: "blur(5px)", transition: "filter 0.4s" }}
                        onLoad={(e) => e.target.style.filter = "blur(0)"}
                      />
                    </LazyLoad>
                  ) : null}
                  <div className="card-content">
                    <h3 className="card-title">
                      <Link to={`/news/${item.id}`} className="card-link">{item.title}</Link>
                    </h3>
                    <span className="news-badge">{item.category}</span>
                    <small className="card-date">
                      {item.createdAt
                        ? (() => {
                            const dateObj =
                              typeof item.createdAt.toDate === "function"
                                ? item.createdAt.toDate()
                                : new Date(item.createdAt);
                            const options = { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
                            return dateObj.toLocaleString("ar-LB", options).replace("،", " -");
                          })()
                        : "—"}
                    </small>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {visibleCounts[cat] < newsArray.length && (
          <button className="show-more-btn" onClick={() => showMore(cat)}>المزيد</button>
        )}
      </div>
    );
  };

  if (category) return renderNewsSection(news, categoryLabels[category] || category, category);

  return (
    <div className="news1">
      {renderNewsSection(filterByCategory("local"), categoryLabels.local, "local")}
      {renderNewsSection(filterByCategory("international"), categoryLabels.international, "international")}
      {renderNewsSection(filterByCategory("sports"), categoryLabels.sports, "sports")}
      {renderNewsSection(filterByCategory("educational"), categoryLabels.educational, "educational")};
      {renderNewsSection(filterByCategory("miscellaneous"), categoryLabels.miscellaneous, "miscellaneous")};
      {renderNewsSection(filterByCategory("advertisement"), categoryLabels.advertisement, "advertisement")}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";

export default function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryText = params.get("query")?.toLowerCase() || "";

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const q = query(collection(db, "all-news")); // كل الأخبار
      const querySnapshot = await getDocs(q);
      const filtered = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item =>
          item.title?.toLowerCase().includes(queryText) || 
          item.content?.toLowerCase().includes(queryText)
        );
      setResults(filtered);
    };

    if (queryText) fetchResults();
    else setResults([]);
  }, [queryText]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>نتائج البحث عن: "{queryText}"</h1>
      {results.length === 0 ? (
        <p>لا توجد نتائج.</p>
      ) : (
        results.map(news => (
          <div key={news.id} style={{ marginBottom: "20px" }}>
            {/* العنوان كرابط */}
            <Link to={`/news/${news.id}`} style={{ fontSize: "20px", fontWeight: "600", color: "#333" ,textDecoration: "none"}}>
              {news.title}
            </Link>
            <p>{news.content?.slice(0, 100)}...</p>
          </div>
        ))
      )}
    </div>
  );
}


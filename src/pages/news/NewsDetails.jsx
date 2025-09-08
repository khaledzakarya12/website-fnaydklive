import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  doc, getDoc, updateDoc, increment, collection, deleteDoc, 
  query, orderBy, limit, getDocs, where 
} from "firebase/firestore";
import { db, auth } from "../../utils/firebaseconfig";
import { useEffect, useState } from "react";
import { FiCopy, FiEdit, FiTrash2, FiShare2 } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import LazyLoad from "react-lazyload";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [visits, setVisits] = useState(0);
  const [hourlyNews, setHourlyNews] = useState([]);
  const [shortLink, setShortLink] = useState(""); // الرابط القصير

  const categoryLabels = {
    international: "إقليمي ودولي",
    sports: "رياضة",
    educational: "تربوي",
    local: "المحلية",
    breaking: "أخبار عاجلة",
    miscellaneous: "متفرقات"
  };

  // روابط الخبر
  const newsUrl = `${window.location.origin}/news/${id}`;
  const shortNewsUrl = shortLink ? `${window.location.origin}/${shortLink}` : newsUrl;

  const copyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(shortNewsUrl);
      alert("✅ تم نسخ الرابط القصير");
    } catch {
      alert("❌ فشل نسخ الرابط");
    }
  };

  const handleEdit = () => navigate(`/edit-news/${id}`);
  const handleDelete = async () => { 
    if(!window.confirm("⚠️ هل أنت متأكد؟")) return; 
    await deleteDoc(doc(db,"all-news",id)); 
    navigate("/"); 
  };

  useEffect(() => { 
    if(auth.currentUser) getDoc(doc(db,"users",auth.currentUser.uid))
      .then(snap => snap.exists() && setUserData(snap.data())); 
  }, []);

  // fetch الأخبار على مدار الساعة
  useEffect(() => {
    const fetchHourlyNews = async () => {
      const snap = await getDocs(query(
        collection(db, "all-news"),
        orderBy("createdAt", "desc"),
        limit(6)
      ));
      const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHourlyNews(news);
    };
    fetchHourlyNews();
    const interval = setInterval(fetchHourlyNews, 60000); 
    return () => clearInterval(interval);
  }, []);

  // جلب بيانات الخبر
  const { data: news, isLoading, error } = useQuery({
    queryKey:["news",id],
    queryFn:async()=>{
      const docRef = doc(db,"all-news",id);
      const snap = await getDoc(docRef);
      if(!snap.exists()) throw new Error("الخبر غير موجود");
      const data = snap.data();

      setVisits(data.visits||0);

      // جلب shortId من مجموعة short-links
      const shortSnap = await getDocs(
        query(collection(db, "short-links"), where("longUrl", "==", `/news/${id}`))
      );
      if (!shortSnap.empty) {
        const shortData = shortSnap.docs[0].data();
        setShortLink(shortData.shortId);
      }

      // زيادة عدد الزيارات
      const visited=JSON.parse(localStorage.getItem("visitedNews")||"[]");
      if(!visited.includes(id)){
        await updateDoc(docRef,{visits:increment(1)});
        visited.push(id);
        localStorage.setItem("visitedNews",JSON.stringify(visited));
        setVisits(prev=>prev+1);
      }
      return data;
    }
  });

  const { data: topNews=[] } = useQuery({
    queryKey:["topNews"],
    queryFn:async()=>{
      const snap=await getDocs(query(collection(db,"all-news"),orderBy("visits","desc"),limit(5)));
      return snap.docs.map(d=>({id:d.id,...d.data()}));
    }
  });

  const formatDate = d => {
    const date = new Date(d); 
    const day = date.getDate();
    const months = ["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2,"0");
    const minutes = String(date.getMinutes()).padStart(2,"0");
    return `${day} ${monthName} ${year} - ${hours}:${minutes}`;
  };

  const formatHourOnly = d => {
    const date = new Date(d);
    const hours = String(date.getHours()).padStart(2,"0");
    const minutes = String(date.getMinutes()).padStart(2,"0");
    return `${hours}:${minutes}`;
  };

  const getFirstImage=item=>item.images?.[0]||item.imageUrl||"https://via.placeholder.com/150";

  const renderImage=(src, alt, height=150)=>{
    const thumb = src.replace("/full/", "/thumb/");
    return (
      <LazyLoad height={height} offset={100} placeholder={<div style={{background:'#333',height:'100%'}}/>}>
        <img
          src={thumb}
          data-src={src}
          alt={alt}
          loading="lazy"
          style={{ filter: "blur(5px)", transition: "filter 0.3s", borderRadius:"8px" }}
          onLoad={e=>{
            const img=e.target;
            const highRes=new Image();
            highRes.src=src;
            highRes.onload=()=>{ img.src=src; img.style.filter="blur(0)"; }
          }}
          srcSet={`${thumb} 480w, ${src} 1200w`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </LazyLoad>
    );
  };

  if(isLoading) return (
    <div className="taili">
      <TailSpin height="50" width="50" color="#db0808" radius="1" visible={true}/>
    </div>
  );

  if(error) return <div className="news-not-found">
    <h2>⚠️ الخبر غير موجود</h2>
    <Link to="/" className="back-home">العودة للرئيسية</Link>
  </div>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        exit={{ opacity:0, y:-20 }}
        transition={{ duration:0.5 }}
        className="newsdata"
      >
        <div className="news-meta">
          <div className="news-date">
            {news.createdAt?.toDate ? formatDate(news.createdAt.toDate()) : formatDate(news.createdAt)}
          </div>
          <div className="news-views">👁️ {visits} مشاهدة</div>
          {news.category && (
            <span className="news-badge">{categoryLabels[news.category] || news.category}</span>
          )}
        </div>

        <div className="news5">
          <h1>{news.title}</h1>
          {userData?.role==="admin" && (
            <div className="admin-actions">
              <FiCopy className="icon-btn" title="نسخ الرابط القصير" onClick={copyShortLink}/>
              
              <FiEdit className="icon-btn" title="تعديل" onClick={handleEdit}/>
              <FiTrash2 className="icon-btn" title="حذف" onClick={handleDelete}/>
            </div>
          )}
          <FiShare2 
                className="icon-btn" 
                title="مشاركة الخبر" 
                onClick={() => {
                  if(navigator.share) {
                    navigator.share({
                      title: news.title,
                      text: news.content.slice(0, 100) + "...",
                      url: shortNewsUrl
                    }).catch(err => console.log(err));
                  } else {
                    alert("خاصية المشاركة غير مدعومة على هذا المتصفح، استخدم زر النسخ.");
                  }
                }}
              />
        </div>

        {news.images?.length ? (
          <div className="news-images">{news.images.map((src, idx)=><div key={idx} className="news-image-wrapper">{renderImage(src, `خبر ${idx}`)}</div>)}</div>
        ) : news.imageUrl ? (
          <div className="news-image-wrapper">{renderImage(news.imageUrl, news.title)}</div>
        ) : null}

        {news.video && (
          <div className="news-video">
            <LazyLoad height={200} offset={100}>
              <video controls preload="none" style={{borderRadius:"8px"}}>
                <source src={news.video} type="video/mp4"/>
                متصفحك لا يدعم الفيديو
              </video>
            </LazyLoad>
          </div>
        )}

        <div className="news-content">{news.content}</div>

        <div className="latest-news">
          <h2>على مدار الساعة</h2>
          <div className="latest-news-list">
            {hourlyNews.map(n => {
              const date = n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt);
              return (
                <Link key={n.id} to={`/news/${n.id}`} className="latest-news-item">
                  <span className="title">{n.title}</span>
                  <span className="date">{formatHourOnly(date)}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="top-news">
          <h2 className="top-news-heading">الأكثر قراءة</h2>
          <div className="top-news-list">
            {topNews
              .filter(n => n.id !== id)
              .sort((a, b) => (b.visits || 0) - (a.visits || 0))
              .slice(0, 5)
              .map((n, index) => (
                <Link key={n.id} to={`/news/${n.id}`} className="top-news-item">
                  <div className="thumb">
                    {n.video ? (
                      <video controls preload="none" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                        <source src={n.video} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={getFirstImage(n) || "/placeholder.png"} alt={n.title} />
                    )}
                  </div>
                  <div className="details">
                    <span className="rank">{index + 1}</span>
                    <span className="title">{n.title}</span>
                    <div className="meta">
                      <span className="views">👁️ {n.visits || 0}</span>
                      <span className="date">
                        {formatDate(n.createdAt?.toDate ? n.createdAt.toDate() : n.createdAt)}
                      </span>
                      {n.category && (
                        <span className="news-badge">{categoryLabels[n.category] || n.category}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

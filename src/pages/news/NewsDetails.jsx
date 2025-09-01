import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, increment, collection, deleteDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../../utils/firebaseconfig";
import { useEffect, useState } from "react";
import { FiCopy, FiEdit, FiTrash2 } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import LazyLoad from "react-lazyload";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [visits, setVisits] = useState(0);
  const newsUrl = `${window.location.origin}/news/${id}`;

  // خريطة البادجات بالعربي
  const categoryLabels = {
    international: "إقليمي ودولي",
    sports: "رياضة",
    educational: "تربوي",
    local: "المحلية",
    breaking: "أخبار عاجلة",
    miscellaneous: "متفرقات"
  };

  const copyLink = async () => { 
    try { 
      await navigator.clipboard.writeText(newsUrl); 
      alert("✅ تم نسخ رابط الخبر"); 
    } catch {} 
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

  const { data: news, isLoading, error } = useQuery({
    queryKey:["news",id],
    queryFn:async()=>{
      const docRef = doc(db,"all-news",id);
      const snap = await getDoc(docRef);
      if(!snap.exists()) throw new Error("الخبر غير موجود");
      const data = snap.data();
      setVisits(data.visits||0);
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

  const formatDate=d=>{
    const months=["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"];
    const days=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    const date=new Date(d); 
    let hours=date.getHours();
    const minutes=String(date.getMinutes()).padStart(2,"0");
    const period=hours>=12?"PM":"AM"; 
    hours=hours%12||12;
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} - ${hours}:${minutes} ${period}`;
  }

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
        {/* ===== Meta: التاريخ + المشاهدات + نوع الخبر ===== */}
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
              <FiCopy className="icon-btn" title="نسخ رابط" onClick={copyLink}/>
              <FiEdit className="icon-btn" title="تعديل" onClick={handleEdit}/>
              <FiTrash2 className="icon-btn" title="حذف" onClick={handleDelete}/>
            </div>
          )}
        </div>

        {/* ===== الصور ===== */}
        {news.images?.length ? (
          <div className="news-images">{news.images.map((src, idx)=><div key={idx} className="news-image-wrapper">{renderImage(src, `خبر ${idx}`)}</div>)}</div>
        ) : news.imageUrl ? (
          <div className="news-image-wrapper">{renderImage(news.imageUrl, news.title)}</div>
        ) : null}

        {/* ===== الفيديو ===== */}
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

        {/* ===== المحتوى ===== */}
        <div className="news-content">{news.content}</div>

        {/* ===== الأكثر قراءة ===== */}
        <div className="top-news">
          <h2>الأكثر قراءة</h2>
          <div className="top-news-list">
            {topNews
              .filter(n => n.id !== id)
              .sort((a,b) => (b.visits || 0) - (a.visits || 0))
              .slice(0, 5)
              .map((n,index) => (
                <Link key={n.id} to={`/news/${n.id}`} className="top-news-item">
                  <span className="rank">{index+1}</span>
                  <div className="thumb">
                    {n.video ? (
                      <video controls preload="none" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"6px"}}>
                        <source src={n.video} type="video/mp4"/>
                      </video>
                    ) : (
                      <img src={getFirstImage(n) || "/placeholder.png"} alt={n.title}/>
                    )}
                  </div>
                  <div className="details">
                    <span className="title">{n.title}</span>
                    <div className="meta">
                      <span className="views">👁️ {n.visits || 0}</span>
                      <span className="date">{n.createdAt?.toDate ? formatDate(n.createdAt.toDate()) : formatDate(n.createdAt)}</span>
                      {n.category && <span className="news-badge">{categoryLabels[n.category] || n.category}</span>}
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

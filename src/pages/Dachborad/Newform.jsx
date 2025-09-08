import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../utils/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export default function NewsFormWithShortLink() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("local");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shortLink, setShortLink] = useState("");
  const navigate = useNavigate();

  const categories = [
    { slug: "local", label: "محلي" },
    { slug: "international", label: "دولي" },
    { slug: "sports", label: "رياضة" },
    { slug: "educational", label: "تربوي" },
    { slug: "miscellaneous", label: "متفرقات" },
    { slug: "breaking", label: "عاجل" },
    { slug: "advertisement", label: "إعلان" },
  ];

  // التحقق من صلاحية الأدمن
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) setUserRole(userDoc.data().role);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || userRole !== "admin") return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      // رفع الصور
      const imageUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const storageRef = ref(storage, `news-images/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // رفع الفيديو
      let video = "";
      if (videoFile) {
        const storageRef = ref(storage, `news-videos/${Date.now()}-${videoFile.name}`);
        await uploadBytes(storageRef, videoFile);
        video = await getDownloadURL(storageRef);
      }

      // إضافة الخبر إلى Firestore
      const docRef = await addDoc(collection(db, "all-news"), {
        title: title.trim(),
        content: content.trim(),
        category: category === "breaking" ? "breaking" : category,
        images: imageUrls,
        video: video,
        createdAt: serverTimestamp()
      });

      // إنشاء رابط قصير تلقائي
      const shortId = Math.floor(100000 + Math.random() * 900000).toString();
      await addDoc(collection(db, "short-links"), {
        shortId: shortId,
        longUrl: `/news/${docRef.id}`,
        createdAt: serverTimestamp()
      });

      const finalShortLink = `${window.location.origin}/${shortId}`;
      setShortLink(finalShortLink);
      navigator.clipboard.writeText(finalShortLink);

      // تنظيف الفورم
      setTitle(""); setContent(""); setCategory("local");
      setImageFiles([]); setImagePreviews([]);
      setVideoFile(null); setVideoPreview(null);

      alert("✔ الخبر نشر! الرابط القصير تم نسخه تلقائياً.");
      navigate("/"); // تحويل المستخدم للصفحة الرئيسية
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء نشر الخبر!");
    }
  };

  return (
    <form className="form4" onSubmit={handleSubmit}>
      <h2>نشر خبر جديد مع رابط قصير للأدمن</h2>
      <input className="input2" type="text" placeholder="عنوان الخبر" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="input1" placeholder="محتوى الخبر" value={content} onChange={(e) => setContent(e.target.value)} />
      <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.label}</option>)}
      </select>

      <input className="image-input" type="file" accept="image/*" multiple onChange={handleImageChange} />
      {imagePreviews.length > 0 && <div className="image-preview-container">{imagePreviews.map((src, idx) => <img key={idx} src={src} alt={`preview-${idx}`} />)}</div>}

      <input className="video-input" type="file" accept="video/*" onChange={handleVideoChange} />
      {videoPreview && <video className="video-preview" controls><source src={videoPreview} type="video/mp4" />متصفحك لا يدعم تشغيل الفيديو</video>}

      <button className="btn" type="submit">نشر الخبر وإرسال إشعار</button>

     
    </form>
  );
}

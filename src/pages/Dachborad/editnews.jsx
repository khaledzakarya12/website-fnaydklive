import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // 🟢 جلب الخبر الحالي
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const docRef = doc(db, "all-news", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setContent(data.content || "");
          setImageUrl(data.imageUrl || "");
        } else {
          alert("⚠️ الخبر غير موجود");
          navigate("/");
        }
      } catch (err) {
        console.error("خطأ بجلب الخبر:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, navigate]);

  // 🟢 حفظ التعديلات
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "all-news", id);
      await updateDoc(docRef, {
        title,
        content,
        imageUrl,
        updatedAt: new Date()
      });
      alert("✅ تم تحديث الخبر بنجاح");
      navigate(`/news/${id}`);
    } catch (err) {
      console.error("❌ خطأ أثناء الحفظ:", err);
      alert("❌ فشل تحديث الخبر");
    }
  };

  if (loading) return <p>⏳ جاري تحميل البيانات...</p>;

  return (
    <div className="edit-news">
      <h1>✏️ تعديل الخبر</h1>
      <form onSubmit={handleSave} >
        
        <label>
          العنوان:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
        
          />
        </label>

        <label>
          المحتوى:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
        
          />
        </label>

        <label>
          رابط الصورة:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
        
          />
        </label>

        {imageUrl && (
          <img src={imageUrl} alt="معاينة الصورة"  />
        )}

        <button className="btn" type="submit">
           حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
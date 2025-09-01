import { useContext ,useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { MainContext } from "../../../utils/context";
import { 
  islocalSelected, isHomeSelected, isInterntionalSelected, 
  isSportSelected, isEducatonalSelected, isDachboradSelected , isBreakingSelected,isMiscellaneousSelected
} from "../../../utils/checkrouter";
import { signOutUser } from "../../../utils/firebasefunction";
import { FiSearch } from "react-icons/fi";
function Mobilemenue({ closeMenu }) {
  const { user, loading, userData } = useContext(MainContext);
  const navigate = useNavigate();
const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      closeMenu(); // يسكر الـ menu بعد البحث
      setSearch(""); // تفريغ البحث
    }
  };
  const handleNavigation = (path) => {
    navigate(path);   // يودي للصفحة
    closeMenu();      // يغلق الـ menu
  };

  const handleSignOut = async () => {
    await signOutUser();
    closeMenu();
    
  };

  return (
    <div className="mobile">
      <div className="mobile-content">
         <form onSubmit={handleSearch} className="w-full mb-4">
          
         <div className="search-wrapper">
  <FiSearch className="search-icon" />
  <input 
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="ابحث هنا..."
    className="search-input"
  />
</div>

        </form>
        <button
          onClick={() => handleNavigation("/")}
          className={`mobile-content-items ${isHomeSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          الرئيسية
        </button>

        <button
          onClick={() => handleNavigation("/local")}
          className={`mobile-content-items ${islocalSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          محليات
        </button>

        <button
          onClick={() => handleNavigation("/international")}
          className={`mobile-content-items ${isInterntionalSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          دوليات
        </button>

        <button
          onClick={() => handleNavigation("/sports")}
          className={`mobile-content-items ${isSportSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          رياضة
        </button>

        <button
          onClick={() => handleNavigation("/educatonal")}
          className={`mobile-content-items ${isEducatonalSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          تربوي
        </button>
        
        <button
          onClick={() => handleNavigation("/miscellaneous")}
          className={`mobile-content-items ${isMiscellaneousSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          متفرقات
        </button>
<button
          onClick={() => handleNavigation("/breaking")}
          className={`mobile-content-items ${isBreakingSelected(window.location.pathname) && "mobile-content-selected"}`}
        >
          عاجل
        </button>
        {userData?.role === "admin" && (
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`mobile-content-items ${isDachboradSelected(window.location.pathname) && "mobile-content-selected"}`}
          >
            لوحة التحكم
          </button>
        )}

        {loading ? (
          <TailSpin height="30" width="30" color="#3b4142" visible={true} />
        ) : user ? (
          <button onClick={handleSignOut} className="primary-btn">
            تسجيل الخروج
          </button>
        ) : (
          <button
            onClick={() => handleNavigation("/autenction")}
            className="primary-btn"
          >
            تسجيل الدخول
          </button>
        )}
      </div>
    </div>
  );
}

export default Mobilemenue;

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../../utils/context";
import { TailSpin } from "react-loader-spinner";
import { signOutUser } from "../../../utils/firebasefunction";

function Desktop() {
  const { user, userData, loading } = useContext(MainContext);
  const navigate = useNavigate();

  const signOut = async () => {
    await signOutUser();
  };

  return (
    <>
      <NavLink to="/" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        الرئيسية
      </NavLink>
      <NavLink to="/local" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        محليات
      </NavLink>
      <NavLink to="/international" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        دوليات
      </NavLink>
      <NavLink to="/educational" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        تربوي
      </NavLink>
      <NavLink to="/sports" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        رياضة
      </NavLink>
      <NavLink to="/miscellaneous" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        متفرقات
      </NavLink>
<NavLink to="/breaking" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
        عاجل
      </NavLink>
      {userData?.role === "admin" && (
        <NavLink to="/dashboard" className={({ isActive }) => `items ${isActive ? "items-selected" : ""}`}>
          لوحة التحكم
        </NavLink>
      )}

      {loading ? (
        <TailSpin
          height="30"
          width="30"
          color="#3b4142"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
      ) : user ? (
        <button onClick={signOut} className="primary">تسجيل الخروج</button>
      ) : (
        <button onClick={() => navigate("/autenction")} className="primary">تسجيل الدخول</button>
      )}
    </>
  );
}

export default Desktop;
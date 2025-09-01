import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getFrontendErrorMessage } from "../../utils/firebasefunction";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

function Registerform() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await registerUser(inputs.username, inputs.email, inputs.password);

    if (res.success) {
      navigate("/");
    } else {
      setError(getFrontendErrorMessage(res.error));
    }
  };

  return (
    <form onSubmit={handleRegister} className="form-register">
      <h2 className="form-title">إنشاء حساب جديد</h2>

      {/* اسم المستخدم */}
      <div className="form-group">
        <label className="form-label" htmlFor="username">إسم المستخدم</label>
        <div className="input-wrapper">
          <FiUser className="input-icon" />
          <input
            onChange={handleInputChange}
            className="input-form"
            type="text"
            value={inputs.username}
            placeholder="أدخل إسم المستخدم"
            name="username"
            required
          />
        </div>
      </div>

      {/* البريد الإلكتروني */}
      <div className="form-group">
        <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
        <div className="input-wrapper">
          <FiMail className="input-icon" />
          <input
            onChange={handleInputChange}
            className="input-form"
            type="email"
            value={inputs.email}
            placeholder="أدخل بريدك الإلكتروني"
            name="email"
            required
          />
        </div>
      </div>

      {/* كلمة السر */}
      <div className="form-group">
        <label className="form-label" htmlFor="password">كلمة السر</label>
        <div className="input-wrapper">
          <FiLock className="input-icon" />
          <input
            onChange={handleInputChange}
            className="input-form"
            type="password"
            value={inputs.password}
            placeholder="أدخل كلمة السر"
            name="password"
            required
          />
        </div>
      </div>

      {/* عرض الخطأ */}
      {error && <div className="form-error">{error}</div>}

      <button className="form-button" type="submit">تسجيل</button>
    </form>
  );
}

export default Registerform;

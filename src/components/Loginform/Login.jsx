import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { signInUser, getFrontendErrorMessage } from "../../utils/firebasefunction";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signInUser(email, password);
    if (res.success) {
      navigate("/");
    } else {
      setError(getFrontendErrorMessage(res.error));
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <h2>تسجيل الدخول إلى حسابك</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
        <div className="input-icon-wrapper">
          <FiMail className="input-icon" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-form"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">كلمة السر</label>
        <div className="input-icon-wrapper">
          <FiLock className="input-icon" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-form"
            placeholder="أدخل كلمة السر"
            required
          />
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="form-button">تسجيل الدخول</button>
    </form>
  );
}

export default LoginForm;

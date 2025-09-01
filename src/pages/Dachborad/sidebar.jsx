import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // حسب طريقة حفظ الدخول
    navigate("/login");
  };


}
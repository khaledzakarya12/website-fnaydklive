import Loginform from "../../components/Loginform/Login";
import Registerform from "../../components/Registerform/Register";
import { MainContext } from "../../utils/context";
import { Navigate,useNavigate } from "react-router-dom";
import { useEffect,useState, useContext } from "react";

function Autenction(){
const [registermode,setregistermode] = useState(false);
const {user ,loading} = useContext(MainContext);
const navigate =useNavigate()
useContext(()=>{

!loading && user && Navigate("/")

},[loading,user]);




return  registermode ? (
<div className="autenction">
<Registerform/>

<p>لديك حساب بالفعل؟ <b onClick={() => setregistermode(false)}    className="autenction-login">تسجيل الدخول</b>
</p>

</div> ):(

<div className="autenction">

<Loginform/>

<p> ليس لديك حساب ؟<b  onClick={() => setregistermode(true)}    className="autenction-register">تسجيل</b></p>



</div>



)





}

export default Autenction;
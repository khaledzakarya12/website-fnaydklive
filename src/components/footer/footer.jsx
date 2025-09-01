import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram, FaWhatsapp } from "react-icons/fa";

import { useLocation } from "react-router-dom";
export default function Footer() {
  const whatsappLink = `https://chat.whatsapp.com/K3icj6GNggJ5YIck5897ym`;
  const facebookLink = "https://www.facebook.com/share/1aTjniRzCq/";
  const instagramLink = "https://www.instagram.chttps://t.me/fnaydkliveom/fnaydk.live?igsh=MXVnbHUzc3lmdmx3Zg==";
  const telegramLink = "https://t.me/fnaydklive";
 const loc = useLocation();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* شعار الموقع */}
        <div className="footer-logo">
          <Link to="/" className="link"> <div className="navbar-left-side-logo"></div> <span className="navbar-left-side-text"> fnaydk<b>Live</b> </span> </Link> 
          
          <p>مصدر إخبارك الأول من عكار والعالم</p>
        </div>

        {/* روابط */}
        <div className="footer-links">
          <Link to="/">الرئيسية</Link>
          <Link to="/who">من نحن</Link>
          <Link to="/privacy">سياسة الخصوصية</Link>
          <Link to="/contact">تواصل معنا</Link>
           <Link to="/development">تطوير</Link>
        </div>
      </div>
      <div className="footer-col">
          <div className="footer-social">
  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
  <a href={instagramLink} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
  <a href="https://twitter.com/YourUsername" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
  <a href={telegramLink} target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
  <a href={facebookLink} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
</div>

<div></div>
        </div>
      {/* حقوق النشر */}
      <div className="footer-bottom">
       <p className="site-footer">
  {new Date().getFullYear()} بوابة فنيدق الإخبارية – منصة إعلامية مستقلة تُعنى بنقل الأخبار والمستجدات المحلية في فنيدق وعكار، بموضوعية ومصداقية، مع التركيز على القضايا الاجتماعية والإنمائية التي تهم المجتمع.
  <br />
  © {new Date().getFullYear()} جميع الحقوق محفوظة – بوابة فنيدق الإخبارية.
</p>

      </div>
    </footer>
  );
}

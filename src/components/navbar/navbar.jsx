import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai"; 
import { RxHamburgerMenu } from "react-icons/rx";
import Desktopmenu from "./desktopmenu/descktop-menu";
import Mobilemenu from "./Mobile-menu/mobile-menue";
import useWindowSize from "../../utils/usewindowize";

function Navbar() {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="navbar-container">
      <div className="navbar">
        {/* Left Side */}
       <div className="navbar-left-side">
  <Link to="/" className="link">
    <div className="navbar-left-side-logo">
      <div className="navbar-left-side-logo-text">
        <span className="navbar-left-side-text">فنيدق</span>
        <span className="navbar-left-side-text"><b>Live</b></span>
      </div>
      <div className="navbar-left-side-symbol">FL</div>
    </div>
  </Link>
</div>

        {/* Right Side */}
        <div className="navbar-right-side">
          {width < 800 ? (
            <div onClick={toggleMenu}>
              {isOpen ? <AiOutlineClose className="NAV" /> : <RxHamburgerMenu className="NAV" />}
            </div>
          ) : (
            <Desktopmenu />
          )}
        </div>
      </div>

      {/* Overlay + Mobile Menu */}
      {width < 800 && (
        <>
          <div
            className={`overlay ${isOpen ? "show" : ""}`}
            onClick={closeMenu}
          ></div>
          <div className={`mobilemenu-wrapper ${isOpen ? "show" : ""}`}>
            <Mobilemenu closeMenu={closeMenu} />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;

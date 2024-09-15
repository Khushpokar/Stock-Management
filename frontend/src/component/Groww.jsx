import React, { useState, useEffect } from 'react';
import { Growwload } from './loadstyles';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// import './Groww.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

function Groww() {
  const [isFixed, setIsFixed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // To manage the collapse state of the navbar

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 150) {
        setIsFixed(true);
      } else {
        setIsFixed(true);
      }
    };

    const cssload = Growwload();

    window.addEventListener('scroll', handleScroll);

    return () => {
      cssload();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapse state
  };

  return (
    <>
      <header className={`header-area overlay ${isFixed ? 'fixed-top' : ''}`}>
        <nav className="navbar navbar-expand-md navbar-light">
          <div className="container">
            <a href="#" className="navbar-brand">Stock.com</a>

            <button
              type="button"
              className={`navbar-toggler ${isCollapsed ? 'collapsed' : ''}`}
              onClick={toggleNavbar}
              aria-controls="main-nav"
              aria-expanded={!isCollapsed}
              aria-label="Toggle navigation"
            >
              <span className="menu-icon-bar"></span>
              <span className="menu-icon-bar"></span>
              <span className="menu-icon-bar"></span>
            </button>

            <div className={`collapse navbar-collapse text-center justify-content-end ${isCollapsed ? '' : 'show'}`} id="main-nav">
              <ul className="navbar-nav ml-auto">
                <li><a href="#" className="nav-item nav-link active">Home</a></li>
                <li><a href="#" className="nav-item nav-link">About Us</a></li>
                <li><a href="#" className="nav-item nav-link">Contact</a></li>
                <li><a href='#' className='btn btn-lg btn-danger  logoutbtn'>LogOut</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div style={{ backgroundColor: 'white', height: '1000px' }}></div>

      <footer className="d-flex">
        <div className="container d-flex justify-content-center">
          <div className='pt-3'>
            <a href="#" className="navbar-brand " style={{ color: 'black' }}>Stock.com</a>
          </div>
          <div className="padding">
            © 2024 Company, Inc
          </div>
        </div>
      </footer>
    </>
  );
}

export default Groww;

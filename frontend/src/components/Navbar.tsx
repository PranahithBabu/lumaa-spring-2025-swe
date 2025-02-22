import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle clicks outside the menu to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  // Add event listener for clicks outside the menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout by removing the token and navigating to the login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="header">
      <h1>Task Management</h1>
      <div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>

         <div className={`menu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
           <ul>
             {currentPage.includes('register') ? (
               <li>
                 <Link to="/login">Login</Link>
               </li>
             ) : currentPage.includes('login') || currentPage === '/' ? (
               <li>
                 <Link to="/register">Register</Link>
               </li>
             ) : (
               <li onClick={handleLogout}>
                 <Link to="/login">Logout</Link>
               </li>
             )}
           </ul>
         </div>
       </div>
     </div>
  );
};

export default Navbar;
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`layout ${!isHomePage ? 'with-background' : ''}`}>
      {children}
    </div>
  );
};

export default Layout; 
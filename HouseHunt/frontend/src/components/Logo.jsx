import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo-container">
      <div className="logo">
        <span className="logo-icon">🏠</span>
        <div className="logo-text">
          <span className="logo-title">House</span>
          <span className="logo-subtitle">Hunt</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo; 
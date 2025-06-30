import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { UserContext } from '../App';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setUserLoggedIn } = useContext(UserContext);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear context state
    setUserData(null);
    setUserLoggedIn(false);
    
    // Navigate to login page
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (userData && userData.type) {
      const userType = userData.type.toLowerCase();
      switch (userType) {
        case 'admin':
          navigate('/adminhome');
          break;
        case 'owner':
          navigate('/ownerhome');
          break;
        case 'renter':
          navigate('/renterhome');
          break;
        default:
          console.error('Invalid user type:', userType);
          navigate('/login');
          break;
      }
    } else {
      console.error('No user data or user type found');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HomeIcon className="home-icon" style={{ fontSize: '2rem' }} />
          <h2 style={{ margin: 0 }}>HouseHunt</h2>
        </div>
      </div>
      <div className="navbar-links">
        {userData ? (
          <>
            <button 
              onClick={handleDashboardClick} 
              style={{
                ...navLinkStyle,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <DashboardIcon style={{ fontSize: '1.5rem' }} />
              Dashboard
            </button>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>Login</Link>
            <Link to="/register" style={navLinkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const navLinkStyle = {
  textDecoration: 'none',
  color: '#2c3e50',
  padding: '8px 16px',
  margin: '0 8px',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.3s ease',
  display: 'inline-block',
  ':hover': {
    backgroundColor: '#e9ecef',
    borderColor: '#dee2e6',
  }
};

const logoutButtonStyle = {
  ...navLinkStyle,
  cursor: 'pointer',
  border: '1px solid #dc3545',
  backgroundColor: '#fff',
  color: '#dc3545',
  ':hover': {
    backgroundColor: '#dc3545',
    color: '#fff',
  }
};

export default Navbar; 
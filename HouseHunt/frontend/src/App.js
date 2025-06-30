import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import { createContext, useEffect, useState, useContext } from "react";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/Owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";
import OwnerProfile from "./modules/user/Owner/OwnerProfile";
import RenterProfile from "./modules/user/renter/RenterProfile";
import theme from './styles/theme';

export const UserContext = createContext();

const ProtectedRoute = ({ children, allowedUserType }) => {
  const { userData, userLoggedIn } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (!userLoggedIn) {
      console.log('User not logged in, redirecting to login');
    } else if (allowedUserType && userData?.type?.toLowerCase() !== allowedUserType.toLowerCase()) {
      console.log('User type mismatch:', userData?.type, 'expected:', allowedUserType);
    }
  }, [userLoggedIn, userData, allowedUserType]);

  if (!userLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedUserType && userData?.type?.toLowerCase() !== allowedUserType.toLowerCase()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  
  useEffect(() => {
    const getData = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          console.log('Found user data:', user);
          setUserData(user);
          setUserLoggedIn(true);
        } else {
          console.log('No user data found in localStorage');
          setUserData(null);
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserData(null);
        setUserLoggedIn(false);
      }
    };

    getData();
  }, []);

  const getDefaultRoute = () => {
    if (!userLoggedIn) return '/login';
    const userType = userData?.type?.toLowerCase();
    console.log('Getting default route for user type:', userType);
    switch (userType) {
      case 'admin':
        return '/adminhome';
      case 'owner':
        return '/ownerhome';
      case 'renter':
        return '/renterhome';
      default:
        console.log('Invalid user type, redirecting to login');
        return '/login';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ userData, setUserData, userLoggedIn, setUserLoggedIn }}>
        <div className="App">
          <Router>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/login" 
                  element={
                    userLoggedIn ? (
                      <Navigate to={getDefaultRoute()} replace />
                    ) : (
                      <Login />
                    )
                  } 
                />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route 
                  path="/adminhome" 
                  element={
                    <ProtectedRoute allowedUserType="admin">
                      <AdminHome />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ownerhome" 
                  element={
                    <ProtectedRoute allowedUserType="owner">
                      <OwnerHome />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/renterhome" 
                  element={
                    <ProtectedRoute allowedUserType="renter">
                      <RenterHome />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/owner/profile" 
                  element={
                    <ProtectedRoute allowedUserType="owner">
                      <OwnerProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/renter/profile" 
                  element={
                    <ProtectedRoute allowedUserType="renter">
                      <RenterProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
              </Routes>
            </div>
            <footer className="bg-light text-center text-lg-start">
              <div className="text-center p-3">
                © {date} Copyright: HouseHunt
              </div>
            </footer>
          </Router>
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;

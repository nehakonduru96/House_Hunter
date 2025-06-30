import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { UserContext } from '../../App';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUserData, setUserLoggedIn } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.email || !formData?.password) {
      message.error("Please fill all fields");
      return;
    }

    try {
      console.log('Attempting login with:', formData.email);
      const response = await axios.post('http://localhost:8001/api/user/login', formData);
      
      if (response.data.success) {
        const user = response.data.user;
        console.log('Login successful, user data:', user);
        
        // Store user data and token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update context
        setUserData(user);
        setUserLoggedIn(true);

        // Log the user type for debugging
        console.log('User type:', user.type);

        // Convert user type to lowercase for case-insensitive comparison
        const userType = user.type.toLowerCase();

        // Navigate based on user type
        if (userType === 'admin') {
          navigate("/adminhome");
        } else if (userType === 'owner') {
          navigate("/ownerhome");
        } else if (userType === 'renter') {
          navigate("/renterhome");
        } else {
          console.error('Invalid user type:', user.type);
          message.error('Invalid user type');
          localStorage.clear();
          setUserData(null);
          setUserLoggedIn(false);
          navigate('/login');
        }
      } else {
        console.error('Login failed:', response.data.message);
        message.error(response.data.message || "Login failed");
        localStorage.clear();
        setUserData(null);
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || "Server not responding. Please try again later.");
      localStorage.clear();
      setUserData(null);
      setUserLoggedIn(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Please login to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
          <div className="auth-links">
            <Link to="/forgotpassword">Forgot Password?</Link>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

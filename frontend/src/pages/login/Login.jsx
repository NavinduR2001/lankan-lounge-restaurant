import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { logo } from '../../assets/assets'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { IoChevronBackCircle } from "react-icons/io5";
import { loginUser, adminLogin } from '../../services/api'; // ✅ Fixed import - added adminLogin
import { useCart } from '../../components/CartContext';

function Login() {
  const navigate = useNavigate();
  const { mergeGuestCartOnLogin } = useCart();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [good, setGood] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      let isAdminLogin = false;

      // First try admin login
      try {
        console.log('🔄 Attempting admin login...');
        response = await adminLogin(formData);
        isAdminLogin = true;
        console.log('✅ Admin login successful:', response.data);
      } catch (adminError) {
        console.log('❌ Admin login failed, trying user login...');
        
        // If admin login fails, try user login
        try {
          response = await loginUser(formData);
          isAdminLogin = false;
          console.log('✅ User login successful:', response.data);
        } catch (userError) {
          console.log('❌ User login also failed');
          throw userError;
        }
      }

// Handle successful login
if (isAdminLogin && response.data.admin && response.data.token) {
  // ✅ Admin login - store admin data with consistent keys
  const adminData = response.data.admin;
  const token = response.data.token;
  
  console.log('💾 Storing admin data:', adminData);
  
  // ✅ Use consistent keys that match Admin.jsx expectations
  localStorage.setItem('token', token);        // ✅ Changed from 'adminToken'
  localStorage.setItem('admin', JSON.stringify(adminData)); // ✅ Changed from 'adminUser'
  localStorage.removeItem('user');  // Clear user data
  
  setGood('Admin login successful!');
  
  setTimeout(() => {
    navigate('/admin-dashboard');
  }, 1000);
  
} else if (!isAdminLogin && response.data.user && response.data.token) {
  // ✅ User login - store user data
  const userData = response.data.user;
  const token = response.data.token;
  
  console.log('💾 Storing user data:', userData);
  
  // Store both token AND user data
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.removeItem('admin'); // ✅ Clear admin data
  
  // ✅ Dispatch login state change event
  console.log('📡 Dispatching loginStateChanged event');
  window.dispatchEvent(new Event('loginStateChanged'));
  
  // Merge guest cart with user cart
  setTimeout(() => {
    mergeGuestCartOnLogin();
  }, 100);
  
  setGood('Login successful! Redirecting...');
  
  // Check for redirect path
  const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
  localStorage.removeItem('redirectAfterLogin');
  
  setTimeout(() => {
    navigate(redirectPath);
  }, 1500);
} else {
  // ✅ Invalid response structure
  console.error('❌ Invalid login response:', response.data);
  setError('Invalid login response. Please try again.');
}
      
    } catch (error) {
      console.error('❌ Final login error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Invalid email or password');
      } else if (error.message.includes('Network Error')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-page'>

      <div className="signin-container">


        <div className="signin-header">
          <div className='back-btn-login'><IoChevronBackCircle  onClick={()=>navigate(-1)}/></div> 
          <div className="line-signin">
            <div className="line signinline"></div>
            <h2 className='signin-subtitle'>Sign In</h2>
            <div className="line signinline"></div>
          </div>
        </div>

        <div className="signin-form-container">
          {error && (
            <div className="error-message-container">
              <p className="error-message">{error}</p>
            </div>
          )}
          {good && (
            <div className="good-message-container">
              <p className="good-message">{good}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signin-form">

            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">Email Address</label>

              <div className="login-password-input-container">
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email' 
                  className="login-form-input"
                  required
                />
              </div>
             
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">Password</label>
              <div className="login-password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password' 
                  className="login-form-input"
                  required
                />
                <span 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                </span>
              </div>
            </div>
               
                  
            
              

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span >Remember me</span>
                
              </label>
            </div>

            <div className="login-container">
            <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? 'wait...' : 'Login'}
              </button></div>

            <div className="signin-footer">
              <p>Don't have an account? 
                <Link to="/register" className="register-link"> Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="imagebg">
        <h1 className="signin-title">Welcome Back!</h1>
      
       
        <p className="signin-description">Enter your credentials to access your account and<br></br>enjoy our delicious services.</p>
         <img src={logo} alt="Logo" className='login-logo' />
      </div>

    </div>
  )
}

export default Login
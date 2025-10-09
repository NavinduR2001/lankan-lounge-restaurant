import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { logo } from '../../assets/assets'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { IoChevronBackCircle } from "react-icons/io5";
import { loginUser } from '../../services/api'; // Import API service

function Login() {
  const navigate = useNavigate();

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
      const response = await loginUser(formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Store user info if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Show success message
      setGood('Login successful!')
      
      // Redirect to home page
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
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

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>

              <div className="password-input-container">
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email' 
                  className="form-input"
                  required
                />
              </div>
             
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password' 
                  className="form-input"
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
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            <div className="login-container">
            <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Login'}
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
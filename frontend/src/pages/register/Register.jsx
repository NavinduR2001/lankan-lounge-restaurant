import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { IoChevronBackCircle } from "react-icons/io5";
import { registerUser } from '../../services/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    district: '',
    contactNumber: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [apiGood, setApiGood] = useState('')

  const districts = [
    'Colombo', 'Kalutara', 'Kandy', 
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
    if (apiError) {
      setApiError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.district) {
      newErrors.district = 'District is required'
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required'
    } else if (!/^[0-9+\-\s]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number format'
    } else if (formData.contactNumber.replace(/[^0-9]/g, '').length < 10) {
      newErrors.contactNumber = 'Contact number must be at least 10 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  const newErrors = validateForm()
  
  if (Object.keys(newErrors).length === 0) {
    setLoading(true)
    setApiError('')
    
    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      console.log('🔄 Registering user:', submitData);
      
      const response = await registerUser(submitData);
      
      console.log('✅ Registration response:', response.data);
      
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
   
        console.log('📡 Dispatching loginStateChanged event');
        window.dispatchEvent(new Event('loginStateChanged'));
        
        setApiGood('Registration successful! Welcome to Gami Gedara!');
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // If no user data in response, just show success and redirect to login
        setApiGood('Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error) {
      console.error(' Registration error:', error);
      
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  } else {
    setErrors(newErrors)
  }
}

  return (
    <div className='register-main-page'> 
      <div className="register-main-container"> 
        <div className="register-main-header"> 
          <div className='register-back-btn'> 
            <IoChevronBackCircle onClick={() => navigate(-1)} />
          </div>
          <div className="register-title-line"> 
            <div className="register-decorative-line"></div> 
            <h2 className='register-main-subtitle'>Create Account</h2> 
            <div className="register-decorative-line"></div> 
          </div>
        </div>

        <div className="register-form-wrapper"> 
          {apiError && (
            <div className="register-api-error-message"> 
              {apiError}
            </div>
          )}

          {apiGood && (
            <div className="register-api-success-message"> 
              {apiGood}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-main-form"> 
            <div className="register-form-row"> 
              <div className="register-form-group"> 
                <label htmlFor="name" className="register-form-label">Full Name</label> 
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`register-form-input ${errors.name ? 'register-input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="register-error-text">{errors.name}</span>} 
              </div>

              <div className="register-form-group">
                <label htmlFor="email" className="register-form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`register-form-input ${errors.email ? 'register-input-error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="register-error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="city" className="register-form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`register-form-input ${errors.city ? 'register-input-error' : ''}`}
                  placeholder="Enter your city"
                />
                {errors.city && <span className="register-error-text">{errors.city}</span>}
              </div>

              <div className="register-form-group">
                <label htmlFor="district" className="register-form-label">District</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`register-form-select ${errors.district ? 'register-input-error' : ''}`}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <span className="register-error-text">{errors.district}</span>}
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="contactNumber" className="register-form-label">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`register-form-input ${errors.contactNumber ? 'register-input-error' : ''}`}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && <span className="register-error-text">{errors.contactNumber}</span>}
            </div>

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="password" className="register-form-label">Password</label>
                <div className="register-password-container"> 
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`register-form-input ${errors.password ? 'register-input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <span className="register-error-text">{errors.password}</span>}
              </div>

              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-form-label">Confirm Password</label>
                <div className="register-password-container">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`register-form-input ${errors.confirmPassword ? 'register-input-error' : ''}`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <span className="register-error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="register-terms-section"> 
              <label className="register-terms-checkbox"> 
                <input type="checkbox" required />
                <span className="register-checkmark"></span> 
                I agree to the <Link to="/terms" className="register-terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="register-terms-link">Privacy Policy</Link> 
              </label>
            </div>

            <div className="register-button-container"> 
              <button type="submit" className="register-submit-button" disabled={loading}> 
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="register-main-footer"> 
              <p>Already have an account?
                <Link to="/login" className="register-signin-link"> Sign In</Link> 
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
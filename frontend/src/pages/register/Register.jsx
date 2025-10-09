import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { IoChevronBackCircle } from "react-icons/io5";
import { registerUser } from '../../services/api'; // Import API service

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
  const [loading, setLoading] = useState(false) // Add loading state
  const [apiError, setApiError] = useState('') // Add API error state
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
    // Clear errors when user starts typing
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
        // Remove confirmPassword before sending to backend
        const submitData = { ...formData };
        delete submitData.confirmPassword;
        
        const response = await registerUser(submitData);
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Show success message
        // alert('Registration successful! Welcome to Lankan Lounge!');

        setApiGood('Registration successful! Welcome to Lankan Lounge!')


        // Redirect to home page or dashboard
        navigate('/');
        
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response?.data?.message) {
          setApiError(error.response.data.message);
        } else if (error.response?.data?.errors) {
          // Handle validation errors from backend
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
    <div className='register-page'>
      <div className="register-container">
        <div className="register-header">
          <div className='back-btn-reg'><IoChevronBackCircle onClick={() => navigate(-1)} /></div>
          <div className="line-register">
            <div className="line registerline"></div>
            <h2 className='register-subtitle'>Create Account</h2>
            <div className="line registerline"></div>
          </div>
        </div>

        <div className="register-form-container">
          {apiError && (
            <div className="api-error-message">
              {apiError}
            </div>
          )}

          {apiGood && (
            <div className="api-good-message">
              {apiGood}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="Enter your city"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">District</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`form-select ${errors.district ? 'error' : ''}`}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <span className="error-message">{errors.district}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`form-input ${errors.contactNumber ? 'error' : ''}`}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-terms">
              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
            </div>

            <div className="reg-btn-align">
              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="register-footer">
              <p>Already have an account?
                <Link to="/login" className="signin-link"> Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
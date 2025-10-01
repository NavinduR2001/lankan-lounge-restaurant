import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { logo } from '../../assets/assets'
import { IoIosEye,IoIosEyeOff } from "react-icons/io";
import { IoChevronBackCircle } from "react-icons/io5";

function Login() {
  const navigate = useNavigate();

  return (
    <div className='signin-page'>

      <div className="signin-container">


        <div className="signin-header">
    
      
          <h1 className="signin-title"><div className='back-btn-login'><IoChevronBackCircle  onClick={()=>navigate(-1)}/></div> Welcome Back</h1>
          <div className="line-signin">
            <div className="line signinline"></div>
            <h2 className='signin-subtitle'>Sign In</h2>
            <div className="line signinline"></div>
          </div>
        </div>

        <div className="signin-form-container">
          <form  className="signin-form">

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>

              <div className="password-input-container">
                <input type="email" id="email"  placeholder='Enter your email' className="form-input" />
              </div>
             
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-container">
                <input type="password" id="password"  placeholder='Enter your password' className="form-input" />
              </div>
            </div>
               
                  
            
              

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            <button type="submit" className="signin-btn" >
              Login
            </button>

            <div className="signin-footer">
              <p>Don't have an account? 
                <Link to="/register" className="register-link"> Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="imagebg">
       <img src={logo} alt="Logo" className='login-logo' />
      </div>

    </div>
  )
}

export default Login
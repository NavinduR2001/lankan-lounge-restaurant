import React, { useState, useEffect } from 'react'
import './Navbar.css'
import {cart, logo} from '../../assets/assets'
import {Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
    const[menu,setMenu]=useState("home")
    const location = useLocation()
    useEffect(() => {
        const path = location.pathname
        if (path === '/') {
            setMenu('home')
        } else if (path === '/about-us') {
            setMenu('about-us')
        } else if (path === '/menu') {
            setMenu('menu')
        } else if (path === '/contact-us') {
            setMenu('contact-us')
        } else if (path === '/cart') {
            setMenu('cart')
            
        }
    }, [location.pathname])
  return (
    <>
    <div className="navbar">
        <div className="navbar-container">

        <div className="logo"><img src={logo}></img></div>    
        <div className='navbar-item'>
        <ul>
    <li onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
    <Link to="/">HOME</Link>
    </li>
    <li onClick={() => setMenu("about-us")} className={menu === "about-us" ? "active" : ""}>
    <Link to="/about-us">ABOUT US</Link>
     </li>
    <li onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
    <Link to="/menu">MENU</Link>
     </li>
     <li onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
    <Link to="/contact-us">CONTACT US</Link>
    </li>
</ul>

        </div>
        <div className='nav-buttons'>
           
            <button className='cart' onClick={()=>navigate('/cart')}>
              <div className='cart-count'>1</div>
              <img src={cart} className='cart-img'></img>
              <label>CART</label>
              </button>
            <Link to="/login">
            <button>LOGIN</button>
            </Link>
        </div>

        </div>
        
    </div>
    </>
  )
}

export default Navbar
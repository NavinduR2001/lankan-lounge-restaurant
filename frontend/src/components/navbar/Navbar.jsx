import React, { useState } from 'react'
import './Navbar.css'
import {cart, logo} from '../../assets/assets'
import {Link} from 'react-router-dom'

function Navbar() {
    const[menu,setMenu]=useState("home")
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
    <Link to="/">ABOUT US</Link>
     </li>
    <li onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
    <Link to="/">MENU</Link>
     </li>
     <li onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
    <Link to="/">CONTACT US</Link>
    </li>
</ul>

        </div>
        <div className='nav-buttons'>
           
            <button className='cart' >
              <div className='cart-count'>1</div>
              <img src={cart} className='cart-img'></img>
              <label>CART</label>
              </button>
            
            <button>SIGN IN</button>
        </div>

        </div>
        
    </div>
    </>
  )
}

export default Navbar
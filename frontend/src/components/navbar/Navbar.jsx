import React, { useState, useEffect } from 'react'
import './Navbar.css'
import {cart, logo} from '../../assets/assets'
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { IoPersonSharp } from "react-icons/io5";

function Navbar() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState("home");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();

    // Check login status on component mount and when localStorage changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                setIsLoggedIn(true);
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkLoginStatus();

        // Listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', checkLoginStatus);
        
        // Custom event for when login state changes in same tab
        window.addEventListener('loginStateChanged', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStateChanged', checkLoginStatus);
        };
    }, []);

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
    }, [location.pathname]);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        
        if (confirmLogout) {
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Update state
            setIsLoggedIn(false);
            setUser(null);
            setShowDropdown(false);
            
            // Dispatch custom event to notify other components
            window.dispatchEvent(new Event('loginStateChanged'));
            
            // Show success message
            alert('Logged out successfully!');
            
            // Redirect to home page
            navigate('/');
        }
    };

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className="logo"><img src={logo} alt="Logo" /></div>    
                    
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
                        <button className='cart' onClick={() => navigate('/cart')}>
                            <div className='cart-count'>1</div>
                            <img src={cart} className='cart-img' alt="Cart" />
                            <label>CART</label>
                        </button>
                        
                        {/* Conditional rendering based on login status */}
                        {isLoggedIn ? (
                            <div className="profile-container">
                                <div className="profile" onClick={handleProfileClick}>
                                    <IoPersonSharp className='profile-icon'/>
                                </div>
                                
                                {/* Profile Dropdown */}
                                {showDropdown && (
                                    <div className="profile-dropdown">
                                        <div className="user-info">
                                            <p className="user-name">{user?.name || 'User'}</p>
                                            <p className="user-email">{user?.email || ''}</p>
                                        </div>
                                        <hr className="dropdown-divider" />
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link to="/cart" onClick={() => setShowDropdown(false)}>
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/cart" onClick={() => setShowDropdown(false)}>
                                                    My Orders
                                                </Link>
                                            </li>
            
                                        </ul>
                                        <hr className="dropdown-divider" />
                                        <button className="logout-btn" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <button>LOGIN</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
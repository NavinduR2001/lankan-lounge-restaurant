import React, {useState, useEffect} from 'react'
import './AdminNavbar.css'
import {logo} from '../../assets/assets'
import {Link, useNavigate}  from 'react-router-dom'
import { MdLogout } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";

function AdminNavbar() {
 const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdminData = localStorage.getItem('admin');
    if (storedAdminData) {
      try {
        const parsedAdminData = JSON.parse(storedAdminData);
        setAdminData(parsedAdminData);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        // Fallback admin data
        setAdminData({
          displayName: 'Admin',
          email: 'admin@gamigedara.lk',
          role: 'admin'
        });
      }
    } else {
      // If no admin data found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

   // ✅ Handle logout
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <>
            <div className="navbar">
                <div className="navbar-container-admin">
                    <div className="logo"><img src={logo} alt="Logo" /></div>    

                    <div className="nav-title"> <h2 className="navbar-title">Admin Dashboard</h2> </div>

                    <div className='nav-buttons admin-nav-buttons'>

                        <div className="admin-name">{adminData?.displayName}</div>
                        <div className="profile admin-profile">
                                    <IoPersonSharp className='profile-icon'/>
                        </div>
                                
                                {/* Profile Dropdown */}
                        <Link to="/login">
                            <button className='admin-logout' onClick={handleLogout}><MdLogout className='logout-icon' />LOGOUT</button>
                        </Link>
                      
                    </div>
                </div>
            </div>
        </>
  )
}

export default AdminNavbar
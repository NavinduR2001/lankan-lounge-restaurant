import React from 'react'
import './AdminNavbar.css'
import {logo} from '../../assets/assets'
import {Link} from 'react-router-dom'
import { IoPersonSharp } from "react-icons/io5";

function AdminNavbar() {
  return (
    <>
            <div className="navbar">
                <div className="navbar-container-admin">
                    <div className="logo"><img src={logo} alt="Logo" /></div>    

                    <div className="nav-title"> <h2 className="navbar-title">Admin Dashboard</h2> </div>

                    <div className='nav-buttons admin-nav-buttons'>
                       
                        <div className="admin-name">Admin 1</div>
                        <div className="profile admin-profile" onClick="">
                                    <IoPersonSharp className='profile-icon'/>
                        </div>
                                
                                {/* Profile Dropdown */}
                        <Link to="/login">
                            <button className='admin-logout'>LOGOUT</button>
                        </Link>
                      
                    </div>
                </div>
            </div>
        </>
  )
}

export default AdminNavbar
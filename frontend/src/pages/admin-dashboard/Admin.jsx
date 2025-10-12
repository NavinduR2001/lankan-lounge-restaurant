import React, { useState } from 'react'
import './Admin.css'
import AdminNavbar from '../../components/admin-navbar/AdminNavbar'
import { MdDelete } from "react-icons/md";

function Admin() {
  // ✅ Fixed useState syntax
  const [activeSection, setActiveSection] = useState('orders');
  const [activeSubmenus, setActiveSubmenus] = useState({
    addItems: false,
    salesReports: false
  });

  // ✅ Separate toggle functions for each submenu
  const toggleSubmenu = (submenuName) => {
    setActiveSubmenus(prev => ({
      ...prev,
      [submenuName]: !prev[submenuName]
    }));
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <div className="menu-section"> 
          <div 
            className={`profile-menu-item ${activeSection === 'orders' ? 'active' : ''}`} 
            onClick={() => setActiveSection('orders')}
          >
            Orders
          </div>
          
          <div 
            className={`profile-menu-item ${activeSection === 'order-history' ? 'active' : ''}`} 
            onClick={() => setActiveSection('order-history')}
          >
            Pending Orders
          </div>
          
          {/* ✅ Add Items with arrow indicator */}
          <div 
            className="profile-menu-item" 
            onClick={() => toggleSubmenu('addItems')}
          >
            Add Items
            <span className={`arrow ${activeSubmenus.addItems ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-profile ${activeSubmenus.addItems ? 'show' : ''}`}>
            <li onClick={() => setActiveSection('add-menu')}>Add Item to Menu</li>
            <li onClick={() => setActiveSection('add-trending')}>Add Trending Items</li>
          </ul>
          
          {/* ✅ Sales Reports with arrow indicator */}
          <div 
            className="profile-menu-item" 
            onClick={() => toggleSubmenu('salesReports')}
          >
            Sales Reports
            <span className={`arrow ${activeSubmenus.salesReports ? 'open' : ''}`}>▼</span>
          </div>
          <ul className={`submenu-profile ${activeSubmenus.salesReports ? 'show' : ''}`}>
            <li onClick={() => setActiveSection('sales-summary')}>Sales Summary</li>
            <li onClick={() => setActiveSection('item-summary')}>Item Summary</li>
          </ul>

          <div 
            className={`profile-menu-item last-p-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </div>
        </div>

        <div className="content-section">
          {/* ✅ Available Orders - Show when activeSection is 'orders' */}
          <div className={`Available-order ${activeSection === 'orders' ? 'show' : ''}`}>
            <div className="ad-topic-header">
              <h2 className='Ad-av-header'>Available Orders</h2>
            </div>

            <div className="content-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Contact</th>
                    <th>Order Items</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Takeaway Time</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody className='orders-table-body'>
                  <tr>
                    <td className='or-table-body-data'>#001</td>
                    <td>John Doe</td>
                    <td>123-456-7890</td>
                    <td>
                      <ul>
                        <li>Pizza</li>
                        <li>Burger</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>2</li>
                        <li>1</li>
                      </ul>
                    </td>
                    <td>$30</td>
                    <td>1:00 PM</td>
                    <td>
                      <div className="button-container">
                        <div className="get-button make-btn">Make</div>
                        <div className="get-button accept-btn">Accept</div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='or-table-body-data'>#002</td>
                    <td>Jane Smith</td>
                    <td>098-765-4321</td>
                    <td>
                      <ul>
                        <li>Pasta</li>
                        <li>Salad</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>1</li>
                        <li>1</li>
                      </ul>
                    </td>
                    <td>$25</td>
                    <td>2:30 PM</td>
                    <td>
                      <div className="button-container">
                        <div className="get-button make-btn">Make</div>
                        <div className="get-button accept-btn">Accept</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Order History - Show when activeSection is 'order-history' */}
          <div className={`Order-history ${activeSection === 'order-history' ? 'show' : ''}`}>
            <div className="ad-topic-header">
              <h2 className='Ad-av-header'>Pending Orders</h2>
            </div>

            <div className="content-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Contact</th>
                    <th>Order Items</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Takeaway Time</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody className='orders-table-body'>
                  <tr>
                    <td className='or-table-body-data'>#003</td>
                    <td>Mike Johnson</td>
                    <td>555-123-4567</td>
                    <td>
                      <ul>
                        <li>Pizza</li>
                        <li>Burger</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>2</li>
                        <li>1</li>
                      </ul>
                    </td>
                    <td>$30</td>
                    <td>12:00 PM</td>
                    <td>
                      <div className="get-button-done">Done</div>
                    </td>
                  </tr>

                  <tr>
                    <td className='or-table-body-data'>#004</td>
                    <td>Sarah Wilson</td>
                    <td>444-567-8901</td>
                    <td>
                      <ul>
                        <li>Pasta</li>
                        <li>Salad</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>1</li>
                        <li>1</li>
                      </ul>
                    </td>
                    <td>$22</td>
                    <td>11:30 AM</td>
                    <td>
                      <div className="get-button-reject">Reject</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Additional sections */}
          {activeSection === 'add-menu' && (
            <div className="section-content">
              <div className="ad-topic-header">
              <h2 className='Ad-av-header'>Add New Menu Item</h2>
            </div>
              <p>Content for adding menu items...</p>
            </div>
          )}

          {activeSection === 'add-trending' && (
            <div className="section-content">
              <h2>Add Trending Items</h2>
              <p>Content for adding trending items...</p>
            </div>
          )}

          {activeSection === 'sales-summary' && (
            <div className="section-content">
              <h2>Sales Summary</h2>
              <p>Content for sales summary...</p>
            </div>
          )}

          {activeSection === 'item-summary' && (
            <div className="section-content">
              <h2>Item Summary</h2>
              <p>Content for item summary...</p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="section-content">
              <h2>Settings</h2>
              <p>Content for settings...</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Admin

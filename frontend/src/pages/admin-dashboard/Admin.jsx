import React from 'react'
import './Admin.css'
import AdminNavbar from '../../components/admin-navbar/AdminNavbar'
import { MdDelete } from "react-icons/md";

function Admin() {
  return (

    <>
    <AdminNavbar />
    <div className="admin-container">

      <div className="menu-section"> 

        <div className="profile-menu-item">Orders</div>
        <div className="profile-menu-item">Orders History</div>
        <div className="profile-menu-item">Add Items</div>
        <ul className="submenu-profile">
          <li>Add Item to Menu</li>
          <li>Add Trending Items</li>
        </ul>
        <div className="profile-menu-item">Sales Reports</div>
        <ul className="submenu-profile">
          <li>Sales Summary</li>
          <li>Item Summary</li>
        </ul>

        <div className="profile-menu-item last-p-item">Settings</div>
      </div>
      




    
      <div className="content-section">
        
        <div className="Available-order">

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
                <th>Takeway Time</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody className='orders-table-body'>
              <tr>
                <td className='or-table-body-data'>001</td>
                <td>John Doe</td>
                <td>123-456-7890</td>
                <td><ul>
                  <li>Pizza</li>
                  <li>Burger</li>
                </ul></td>
                <td> <ul>
                  <li>2</li>
                  <li>1</li>
                </ul> </td>
                <td>$30</td>
                <td>1.00 PM</td>
                <td><div className="get-button">Make</div><div className="get-button">Accept</div> </td>
              </tr>

              <tr>
                <td className='or-table-body-data'>001</td>
                <td>John Doe</td>
                <td>123-456-7890</td>
                <td><ul>
                  <li>Pizza</li>
                  <li>Burger</li>
                </ul></td>
                <td> <ul>
                  <li>2</li>
                  <li>1</li>
                </ul> </td>
                <td>$30</td>
                <td>1.00 PM</td>
                <td><div className="get-button">Make</div><div className="get-button">Accept</div>  </td>
              </tr>

              
            </tbody>

            <tbody>
              {/* Map through your orders data and create table rows here */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="Order-history">

        <div className="ad-topic-header">
            <h2 className='Ad-av-header'>Order History</h2>
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
                <th>Takeway Time</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody className='orders-table-body'>
              <tr>
                <td className='or-table-body-data'>001</td>
                <td>John Doe</td>
                <td>123-456-7890</td>
                <td><ul>
                  <li>Pizza</li>
                  <li>Burger</li>
                </ul></td>
                <td> <ul>
                  <li>2</li>
                  <li>1</li>
                </ul> </td>
                <td>$30</td>
                <td>1.00 PM</td>
                <td><div className="get-button-done">Done</div></td>
              </tr>

              <tr>
                <td className='or-table-body-data'>001</td>
                <td>John Doe</td>
                <td>123-456-7890</td>
                <td><ul>
                  <li>Pizza</li>
                  <li>Burger</li>
                </ul></td>
                <td> <ul>
                  <li>2</li>
                  <li>1</li>
                </ul> </td>
                <td>$30</td>
                <td>1.00 PM</td>
                <td><div className="get-button-reject">Reject</div> </td>
              </tr>

              
            </tbody>

            <tbody>
              {/* Map through your orders data and create table rows here */}
            </tbody>
          </table>
        </div>
      </div>


      </div>
        







    </div>
    </>
  )
}

export default Admin

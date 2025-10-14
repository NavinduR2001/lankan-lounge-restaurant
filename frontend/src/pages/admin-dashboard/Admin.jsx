import React, { useState } from 'react'
import './Admin.css'
import AdminNavbar from '../../components/admin-navbar/AdminNavbar'
import { MdDelete } from "react-icons/md";
import { addMenuItem } from '../../services/api'; // ✅ Add this import

function Admin() {


  const [formData, setformData] = useState({
    itemName: "",
    itemCategory: "",
    foodID: "",
    itemPrice: "",
    itemDescription: "",
    itemImage: null
  })

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // ✅ Add success message state

  const [activeSection, setActiveSection] = useState('orders');
  const [activeSubmenus, setActiveSubmenus] = useState({
    addItems: false,
    salesReports: false
  });

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.itemName.trim()) errors.itemName = "Item name is required";
    if (!formData.itemCategory) errors.itemCategory = "Item category is required";
    if (!formData.foodID.trim()) errors.foodID = "Food ID is required";
    if (!formData.itemPrice || formData.itemPrice <= 0) errors.itemPrice = "Valid item price is required";
    if (!formData.itemDescription.trim()) errors.itemDescription = "Item description is required";
    if (!formData.itemImage) errors.itemImage = "Item image is required";
    return Object.keys(errors).length ? errors : null;
  };

  // ✅ Updated handleSubmit with real API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    const validationErrors = validateForm(formData);
    
    if (validationErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    
    try {
      console.log("Form is valid. Submitting data:", {
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        foodID: formData.foodID,
        itemPrice: formData.itemPrice,
        itemDescription: formData.itemDescription,
        itemImage: formData.itemImage ? formData.itemImage.name : 'No file',
        isTrending: activeSection === 'add-trending'
      });
      
      const submitData = {
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        foodID: formData.foodID,
        itemPrice: formData.itemPrice,
        itemDescription: formData.itemDescription,
        itemImage: formData.itemImage,
        isTrending: activeSection === 'add-trending'
      };
      
      console.log("Calling API with data:", submitData);
      const response = await addMenuItem(submitData);
      
      console.log('Item added successfully:', response.data);
      
      setSuccessMessage(response.data.message || 'Item added successfully!');
      
      // Reset form
      setformData({
        itemName: "",
        itemCategory: "",
        foodID: "",
        itemPrice: "",
        itemDescription: "",
        itemImage: null
      });
      
      // Clear file input
      const fileInput = document.getElementById(activeSection === 'add-trending' ? 'trending-item-image' : 'item-image');
      if (fileInput) fileInput.value = '';
      
      setIsSubmitting(false);
      
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        
        const errorMessage = error.response.data.message || 'Failed to add item';
        setErrors({ submit: errorMessage });
        
        if (error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('itemName')) serverErrors.itemName = err;
            if (err.includes('itemCategory')) serverErrors.itemCategory = err;
            if (err.includes('foodID')) serverErrors.foodID = err;
            if (err.includes('itemPrice')) serverErrors.itemPrice = err;
            if (err.includes('itemDescription')) serverErrors.itemDescription = err;
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
        }
      } else if (error.request) {
        console.error("Network error - no response received");
        setErrors({ submit: "Network error. Please check your connection and try again." });
      } else {
        console.error("Request setup error:", error.message);
        setErrors({ submit: "An unexpected error occurred. Please try again." });
      }
      
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    setformData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
    
    console.log(`Field ${name} updated with value:`, files ? files[0] : value);
  };

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
        {/* Menu Section - Same as before */}
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
            Order History
          </div>
          
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
          {/* Orders and History sections - Same as before */}
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

          <div className={`Order-history ${activeSection === 'order-history' ? 'show' : ''}`}>
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

          {/* ✅ Updated Add Menu Form with Error Display */}
          {activeSection === 'add-menu' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Add New Menu Item</h2>
              </div>
              <div className="add-item-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    {/* Success message */}
                    {successMessage && (
                      <div className="success-message">{successMessage}</div>
                    )}

                    {/* Submit error */}
                    {errors.submit && (
                      <div className="error-message submit-error">{errors.submit}</div>
                    )}

                    <label htmlFor="item-name">Item Name:</label>
                    <input 
                      name="itemName"
                      id="item-name" 
                      type="text" 
                      placeholder="Enter item name" 
                      value={formData.itemName} 
                      onChange={handleInputChange}
                      className={errors.itemName ? 'error' : ''}
                    />
                    {errors.itemName && <div className="error-message">{errors.itemName}</div>}
                    
                    <label htmlFor="item-category">Select Category:</label>
                    <select 
                      name="itemCategory"
                      id="item-category"
                      value={formData.itemCategory}
                      onChange={handleInputChange}
                      className={errors.itemCategory ? 'error' : ''}
                    >
                      <option value="">Select a category</option>
                      <option value="sri-lankan">01 - Sri Lankan Food</option>
                      <option value="indian">02 - Indian Food</option>
                      <option value="chinese">03 - Chinese Food</option>
                      <option value="family-meals">04 - Family Meals</option>
                      <option value="desserts">05 - Desserts</option>
                      <option value="bakery">06 - Bakery Items</option>
                      <option value="pizza">07 - Pizza</option>
                      <option value="beverages">08 - Beverages</option>
                    </select>
                    {errors.itemCategory && <div className="error-message">{errors.itemCategory}</div>}
                    
                    <label htmlFor="food-id">Food ID:</label>
                    <input 
                      name="foodID"
                      id="food-id" 
                      type="text" 
                      placeholder="Enter food ID" 
                      value={formData.foodID} 
                      onChange={handleInputChange}
                      className={errors.foodID ? 'error' : ''}
                    />
                    {errors.foodID && <div className="error-message">{errors.foodID}</div>}
                    
                    <label htmlFor="item-price">Item Price:</label>
                    <input 
                      name="itemPrice"
                      id="item-price" 
                      type="number" 
                      placeholder="Enter item price" 
                      value={formData.itemPrice} 
                      onChange={handleInputChange}
                      className={errors.itemPrice ? 'error' : ''}
                      min="0"
                      step="0.01"
                    />
                    {errors.itemPrice && <div className="error-message">{errors.itemPrice}</div>}
                    
                    <label htmlFor="item-description">Item Description:</label>
                    <textarea 
                      name="itemDescription"
                      id="item-description" 
                      placeholder="Enter item description" 
                      value={formData.itemDescription} 
                      onChange={handleInputChange}
                      className={errors.itemDescription ? 'error' : ''}
                    ></textarea>
                    {errors.itemDescription && <div className="error-message">{errors.itemDescription}</div>}
                    
                    <label htmlFor="item-image">Item Image:</label>
                    <input 
                      name="itemImage"
                      id="item-image" 
                      type="file" 
                      onChange={handleInputChange}
                      accept="image/*"
                      className={errors.itemImage ? 'error' : ''}
                    />
                    {errors.itemImage && <div className="error-message">{errors.itemImage}</div>}
                    
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding Item...' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ✅ Fixed Add Trending Form */}
          {activeSection === 'add-trending' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Add Trending Items</h2>
              </div>
              <div className="add-item-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    {successMessage && (
                      <div className="success-message">{successMessage}</div>
                    )}

                    {errors.submit && (
                      <div className="error-message submit-error">{errors.submit}</div>
                    )}

                    <label htmlFor="trending-item-name">Item Name:</label>
                    <input 
                      name="itemName"
                      id="trending-item-name" 
                      type="text" 
                      placeholder="Enter item name"
                      value={formData.itemName} 
                      onChange={handleInputChange}
                      className={errors.itemName ? 'error' : ''}
                    />
                    {errors.itemName && <div className="error-message">{errors.itemName}</div>}
                    
                    <label htmlFor="trending-item-category">Select Category:</label>
                    <select 
                      name="itemCategory"
                      id="trending-item-category"
                      value={formData.itemCategory}
                      onChange={handleInputChange}
                      className={errors.itemCategory ? 'error' : ''}
                    >
                      <option value="">Select a category</option>
                      <option value="sri-lankan">01 - Sri Lankan Food</option>
                      <option value="indian">02 - Indian Food</option>
                      <option value="chinese">03 - Chinese Food</option>
                      <option value="family-meals">04 - Family Meals</option>
                      <option value="desserts">05 - Desserts</option>
                      <option value="bakery">06 - Bakery Items</option>
                      <option value="pizza">07 - Pizza</option>
                      <option value="beverages">08 - Beverages</option>
                    </select>
                    {errors.itemCategory && <div className="error-message">{errors.itemCategory}</div>}
                    
                    <label htmlFor="trending-food-id">Food ID:</label>
                    <input 
                      name="foodID"
                      id="trending-food-id" 
                      type="text" 
                      placeholder="Enter food ID"
                      value={formData.foodID} 
                      onChange={handleInputChange}
                      className={errors.foodID ? 'error' : ''}
                    />
                    {errors.foodID && <div className="error-message">{errors.foodID}</div>}
                    
                    <label htmlFor="trending-item-price">Item Price:</label>
                    <input 
                      name="itemPrice"
                      id="trending-item-price" 
                      type="number" 
                      placeholder="Enter item price"
                      value={formData.itemPrice} 
                      onChange={handleInputChange}
                      className={errors.itemPrice ? 'error' : ''}
                      min="0"
                      step="0.01"
                    />
                    {errors.itemPrice && <div className="error-message">{errors.itemPrice}</div>}
                    
                    <label htmlFor="trending-item-description">Item Description:</label>
                    <textarea 
                      name="itemDescription"
                      id="trending-item-description" 
                      placeholder="Enter item description"
                      value={formData.itemDescription} 
                      onChange={handleInputChange}
                      className={errors.itemDescription ? 'error' : ''}
                    ></textarea>
                    {errors.itemDescription && <div className="error-message">{errors.itemDescription}</div>}
                    
                    <label htmlFor="trending-item-image">Item Image:</label>
                    <input 
                      name="itemImage"
                      id="trending-item-image" 
                      type="file"
                      onChange={handleInputChange}
                      accept="image/*"
                      className={errors.itemImage ? 'error' : ''}
                    />
                    {errors.itemImage && <div className="error-message">{errors.itemImage}</div>}

                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding Trending Item...' : 'Add Trending Item'}
                    </button>
                  </div>
                </form>
              </div>
            
            </div>
          )}

          {/* ✅ Sales Summary Section */}
          {activeSection === 'sales-summary' && (
  <div className="section-content">
    <div className="ad-topic-header">
      <h2 className='Ad-av-header'>Sales Summary Report</h2>
    </div>
    
    {/* Summary Cards */}
    <div className="summary-cards">
      <div className="summary-card">
        <h3>Today's Sales</h3>
        <p className="amount">Rs. 45,850.00</p>
        <span className="change positive">+12.5% from yesterday</span>
      </div>
      <div className="summary-card">
        <h3>This Week</h3>
        <p className="amount">Rs. 285,920.00</p>
        <span className="change positive">+8.3% from last week</span>
      </div>
      <div className="summary-card">
        <h3>This Month</h3>
        <p className="amount">Rs. 1,125,480.00</p>
        <span className="change negative">-2.1% from last month</span>
      </div>
      <div className="summary-card">
        <h3>Total Orders</h3>
        <p className="amount">2,847</p>
        <span className="change positive">+15.8% this month</span>
      </div>
    </div>

    {/* Date Filter */}
    <div className="filter-section">
      <div className="date-filters">
        <label>From Date:</label>
        <input type="date" className="date-input" defaultValue="2024-01-01" />
        <label>To Date:</label>
        <input type="date" className="date-input" defaultValue="2024-01-31" />
        <button className="filter-btn">Generate Report</button>
      </div>
    </div>

    {/* Sales Table */}
    <div className="content-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Orders</th>
            <th>Total Revenue</th>
            <th>Average Order</th>
            <th>Top Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-01-15</td>
            <td>87</td>
            <td>Rs. 45,850.00</td>
            <td>Rs. 527.01</td>
            <td>Pizza</td>
            <td><span className="status-badge success">Completed</span></td>
          </tr>
          <tr>
            <td>2024-01-14</td>
            <td>92</td>
            <td>Rs. 48,920.00</td>
            <td>Rs. 531.96</td>
            <td>Sri Lankan</td>
            <td><span className="status-badge success">Completed</span></td>
          </tr>
          <tr>
            <td>2024-01-13</td>
            <td>78</td>
            <td>Rs. 41,230.00</td>
            <td>Rs. 528.59</td>
            <td>Indian</td>
            <td><span className="status-badge success">Completed</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Export Buttons */}
    <div className="export-section">
      <button className="export-btn pdf">Download PDF</button>
      <button className="export-btn excel">Export to Excel</button>
      <button className="export-btn print">Print Report</button>
    </div>
  </div>
)}

{/* ✅ Item Summary Section */}
{activeSection === 'item-summary' && (
  <div className="section-content">
    <div className="ad-topic-header">
      <h2 className='Ad-av-header'>Item Sales Summary</h2>
    </div>

    {/* Top Performing Items */}
    <div className="performance-section">
      <h3>Top Performing Items</h3>
      <div className="performance-grid">
        <div className="performance-card best">
          <div className="rank">🥇</div>
          <div className="item-info">
            <h4>Chicken Rice</h4>
            <p>425 orders • Rs. 127,500</p>
          </div>
        </div>
        <div className="performance-card second">
          <div className="rank">🥈</div>
          <div className="item-info">
            <h4>Margherita Pizza</h4>
            <p>387 orders • Rs. 116,100</p>
          </div>
        </div>
        <div className="performance-card third">
          <div className="rank">🥉</div>
          <div className="item-info">
            <h4>Fish Curry</h4>
            <p>342 orders • Rs. 102,600</p>
          </div>
        </div>
      </div>
    </div>

    {/* Category Performance */}
    <div className="category-performance">
      <h3>Category Performance</h3>
      <div className="category-grid">
        <div className="category-card">
          <h4>Sri Lankan Food</h4>
          <div className="progress-bar">
            <div className="progress" style={{width: '85%'}}></div>
          </div>
          <p>85% • 1,245 orders</p>
        </div>
        <div className="category-card">
          <h4>Pizza</h4>
          <div className="progress-bar">
            <div className="progress" style={{width: '72%'}}></div>
          </div>
          <p>72% • 892 orders</p>
        </div>
        <div className="category-card">
          <h4>Indian Food</h4>
          <div className="progress-bar">
            <div className="progress" style={{width: '68%'}}></div>
          </div>
          <p>68% • 745 orders</p>
        </div>
        <div className="category-card">
          <h4>Chinese Food</h4>
          <div className="progress-bar">
            <div className="progress" style={{width: '45%'}}></div>
          </div>
          <p>45% • 432 orders</p>
        </div>
      </div>
    </div>

    {/* Detailed Item Table */}
    <div className="content-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Total Sold</th>
            <th>Revenue</th>
            <th>Avg Price</th>
            <th>Stock Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Chicken Rice</td>
            <td>Sri Lankan</td>
            <td>425</td>
            <td>Rs. 127,500.00</td>
            <td>Rs. 300.00</td>
            <td><span className="status-badge success">In Stock</span></td>
          </tr>
          <tr>
            <td>Margherita Pizza</td>
            <td>Pizza</td>
            <td>387</td>
            <td>Rs. 116,100.00</td>
            <td>Rs. 450.00</td>
            <td><span className="status-badge warning">Low Stock</span></td>
          </tr>
          <tr>
            <td>Fish Curry</td>
            <td>Sri Lankan</td>
            <td>342</td>
            <td>Rs. 102,600.00</td>
            <td>Rs. 350.00</td>
            <td><span className="status-badge success">In Stock</span></td>
          </tr>
          <tr>
            <td>Chicken Biryani</td>
            <td>Indian</td>
            <td>298</td>
            <td>Rs. 89,400.00</td>
            <td>Rs. 400.00</td>
            <td><span className="status-badge danger">Out of Stock</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ✅ Enhanced Settings Section with Admin Management */}
{activeSection === 'settings' && (
  <div className="section-content">
    <div className="ad-topic-header">
      <h2 className='Ad-av-header'>Restaurant Settings</h2>
    </div>

    <div className="settings-container">
      {/* Restaurant Information - Keep existing */}
      <div className="settings-section">
        <h3>Restaurant Information</h3>
        <div className="form-group">
          <label>Restaurant Name:</label>
          <input type="text" defaultValue="Gami Gedara Restaurant" className="settings-input" />
          
          <label>Address:</label>
          <textarea className="settings-input" defaultValue="123 Main Street, Colombo 07, Sri Lanka" rows="3"></textarea>
          
          <label>Phone Number:</label>
          <input type="tel" defaultValue="+94 11 234 5678" className="settings-input" />
          
          <label>Email:</label>
          <input type="email" defaultValue="info@gamigedara.lk" className="settings-input" />
          
          <label>Operating Hours:</label>
          <div className="time-inputs">
            <input type="time" defaultValue="08:00" className="settings-input small" />
            <span>to</span>
            <input type="time" defaultValue="22:00" className="settings-input small" />
          </div>
        </div>
      </div>

      {/* ✅ Main Admin Account Management */}
      <div className="settings-section">
        <h3>🔐 Main Admin Account</h3>
        <div className="form-group">
          <label>Current Username:</label>
          <input type="text" defaultValue="admin" className="settings-input" placeholder="Enter new username" />
          
          <label>Admin Display Name:</label>
          <input type="text" defaultValue="Super Admin" className="settings-input" placeholder="Enter display name" />
          
          <label>Current Password:</label>
          <input type="password" placeholder="Enter current password" className="settings-input" />
          
          <label>New Password:</label>
          <input type="password" placeholder="Enter new password (leave blank to keep current)" className="settings-input" />
          
          <label>Confirm New Password:</label>
          <input type="password" placeholder="Confirm new password" className="settings-input" />
          
          <div className="admin-actions">
            <button className="settings-btn save">Update Main Admin</button>
          </div>
        </div>
      </div>

      {/* ✅ Secondary Admin Management */}
      <div className="settings-section">
        <h3>👥 Secondary Admin Management</h3>
        
        {/* Add New Secondary Admin */}
        <div className="add-admin-form">
          <h4>Add New Secondary Admin</h4>
          <div className="form-group">
            <div className="admin-form-row">
              <div className="form-field">
                <label>Username:</label>
                <input type="text" placeholder="Enter username" className="settings-input" />
              </div>
              <div className="form-field">
                <label>Admin Name:</label>
                <input type="text" placeholder="Enter full name" className="settings-input" />
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="form-field">
                <label>Password:</label>
                <input type="password" placeholder="Enter password" className="settings-input" />
              </div>
              <div className="form-field">
                <label>Confirm Password:</label>
                <input type="password" placeholder="Confirm password" className="settings-input" />
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="form-field">
                <label>Email:</label>
                <input type="email" placeholder="Enter email address" className="settings-input" />
              </div>
              <div className="form-field">
                <label>Role:</label>
                <select className="settings-input">
                  <option value="secondary-admin">Secondary Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
            
            <div className="permissions-section">
              <label>Permissions:</label>
              <div className="permissions-grid">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  View Orders
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Manage Orders
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Add Menu Items
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Edit Menu Items
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  View Sales Reports
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Manage Settings
                </label>
              </div>
            </div>
            
            <button className="settings-btn add-admin">Add Secondary Admin</button>
          </div>
        </div>

        {/* Existing Secondary Admins List */}
        <div className="existing-admins">
          <h4>Current Secondary Admins</h4>
          <div className="admin-cards">
            
            {/* Admin Card 1 */}
            <div className="admin-card">
              <div className="admin-info">
                <div className="admin-avatar">
                  <span>JD</span>
                </div>
                <div className="admin-details">
                  <h5>John Doe</h5>
                  <p>@johndoe</p>
                  <span className="admin-role">Manager</span>
                  <small>Last login: 2 hours ago</small>
                </div>
              </div>
              
              <div className="admin-permissions">
                <div className="permission-tags">
                  <span className="permission-tag">Orders</span>
                  <span className="permission-tag">Menu</span>
                  <span className="permission-tag">Reports</span>
                </div>
              </div>
              
              <div className="admin-actions-card">
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">
                  <MdDelete className="delete-icon" />
                </button>
                <button className="action-btn suspend">Suspend</button>
              </div>
            </div>

            {/* Admin Card 2 */}
            <div className="admin-card">
              <div className="admin-info">
                <div className="admin-avatar">
                  <span>SM</span>
                </div>
                <div className="admin-details">
                  <h5>Sarah Miller</h5>
                  <p>@sarahmiller</p>
                  <span className="admin-role">Secondary Admin</span>
                  <small>Last login: 1 day ago</small>
                </div>
              </div>
              
              <div className="admin-permissions">
                <div className="permission-tags">
                  <span className="permission-tag">Orders</span>
                  <span className="permission-tag">Menu</span>
                </div>
              </div>
              
              <div className="admin-actions-card">
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">
                  <MdDelete className="delete-icon" />
                </button>
                <button className="action-btn suspend">Suspend</button>
              </div>
            </div>

            {/* Admin Card 3 */}
            <div className="admin-card">
              <div className="admin-info">
                <div className="admin-avatar">
                  <span>MJ</span>
                </div>
                <div className="admin-details">
                  <h5>Mike Johnson</h5>
                  <p>@mikejohnson</p>
                  <span className="admin-role suspended">Supervisor (Suspended)</span>
                  <small>Last login: 1 week ago</small>
                </div>
              </div>
              
              <div className="admin-permissions">
                <div className="permission-tags">
                  <span className="permission-tag disabled">No Access</span>
                </div>
              </div>
              
              <div className="admin-actions-card">
                <button className="action-btn edit">Edit</button>
                <button className="action-btn delete">
                  <MdDelete className="delete-icon" />
                </button>
                <button className="action-btn activate">Activate</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Order Settings - Keep existing */}
      <div className="settings-section">
        <h3>Order Settings</h3>
        <div className="form-group">
          <label>Discount Rate (%)</label>
          <input type="number" defaultValue="10%" className="settings-input" placeholder="%" />
          
          <label>Service Fee Rate (%)</label>
          <input type="number" defaultValue="10%" className="settings-input" placeholder="%" />
          
         
        </div>
      </div>

      

      {/* Action Buttons */}
      <div className="settings-actions">
        <button className="settings-btn save">Save Changes</button>
        <button className="settings-btn reset">Reset</button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </>
  )
}

export default Admin

import React, { useState, useEffect } from 'react'
import './Admin.css'
import AdminNavbar from '../../components/admin-navbar/AdminNavbar'
import AdminSettings from '../admin-setting/AdminSettings'  // ✅ Correct import path
import { addMenuItem } from '../../services/api'

function Admin() {
  // Form state for menu items
  const [formData, setformData] = useState({
    itemName: "",
    itemCategory: "",
    foodID: "",
    itemPrice: "",
    itemDescription: "",
    itemImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Navigation state
  const [activeSection, setActiveSection] = useState('orders');
  const [activeSubmenus, setActiveSubmenus] = useState({
    addItems: false,
    salesReports: false
  });

  // Check authentication on mount
  useEffect(() => {
    const validateStoredData = () => {
      const admin = localStorage.getItem('admin');
      const token = localStorage.getItem('token');
      
      if (!admin || !token) {
        window.location.href = '/login';  // ✅ This is fine here
        return false;
      }
      
      try {
        const parsedAdmin = JSON.parse(admin);
        if (!parsedAdmin.id || !parsedAdmin.email) {
          localStorage.removeItem('admin');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return false;
        }
        return true;
      } catch {
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return false;
      }
    };
    
    validateStoredData();
  }, []);

  // Enhanced form validation
  const validateForm = (formData) => {
    const errors = {};
    if (!formData.itemName.trim()) errors.itemName = "Item name is required";
    if (!formData.itemCategory) errors.itemCategory = "Item category is required";
    if (!formData.foodID.trim()) errors.foodID = "Food ID is required";
    if (!formData.itemPrice || formData.itemPrice <= 0) errors.itemPrice = "Valid item price is required";
    if (!formData.itemDescription.trim()) errors.itemDescription = "Item description is required";
    
    // Enhanced image validation
    if (!formData.itemImage) {
      errors.itemImage = "Item image is required";
    } else if (formData.itemImage && !(formData.itemImage instanceof File)) {
      errors.itemImage = "Please select a valid image file";
    }
    
    return Object.keys(errors).length ? errors : null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    console.log('Form submission started with data:', {
      itemName: formData.itemName,
      itemCategory: formData.itemCategory,
      foodID: formData.foodID,
      itemPrice: formData.itemPrice,
      itemDescription: formData.itemDescription,
      imageFile: formData.itemImage ? {
        name: formData.itemImage.name,
        type: formData.itemImage.type,
        size: formData.itemImage.size
      } : null,
      isTrending: activeSection === 'add-trending'
    });
    
    const validationErrors = validateForm(formData);
    
    if (validationErrors) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});
    
    try {
      const submitData = {
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        foodID: formData.foodID,
        itemPrice: formData.itemPrice,
        itemDescription: formData.itemDescription,
        itemImage: formData.itemImage, // This should be a File object
        isTrending: activeSection === 'add-trending'
      };
      
      console.log('Submitting data:', submitData);
      
      const response = await addMenuItem(submitData);
      
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
      console.error("Submission error:", error);
      
      if (error.response) {
        console.log('Server response:', error.response.data);
        const errorMessage = error.response.data.message || 'Failed to add item';
        setErrors({ submit: errorMessage });
      } else {
        setErrors({ submit: "Network error. Please check your connection and try again." });
      }
      
      setIsSubmitting(false);
    }
  };

  // Add this function before handleInputChange
  const debugFileSelection = (file) => {
    console.log('=== FILE DEBUG ===');
    console.log('File object:', file);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
    console.log('Is File instance:', file instanceof File);
    console.log('File constructor:', file.constructor.name);
    console.log('==================');
  };

  // Handle input changes - Enhanced file handling
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'itemImage' && files && files[0]) {
      const file = files[0];
      
      // ✅ Add debug logging
      debugFileSelection(file);
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          itemImage: "Please select a valid image file (JPG, PNG, GIF, WEBP)"
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          itemImage: "File size must be less than 5MB"
        }));
        return;
      }
      
      setformData((prevData) => ({
        ...prevData,
        [name]: file
      }));
      
      // ✅ Verify the file is stored correctly
      setTimeout(() => {
        console.log('FormData after setting:', formData.itemImage);
      }, 100);
      
    } else {
      setformData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Toggle submenu
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
        {/* Menu Section */}
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
          {/* Orders Section */}
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Order History Section */}
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Menu Form */}
          {activeSection === 'add-menu' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Add New Menu Item</h2>
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

          {/* Add Trending Form - Similar to Add Menu but with different header */}
          {activeSection === 'add-trending' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Add Trending Items</h2>
              </div>
              {/* Same form as add-menu but with trending-specific IDs */}
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

          {/* Sales Reports Sections */}
          {activeSection === 'sales-summary' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Sales Summary Report</h2>
              </div>
              {/* Sales summary content */}
            </div>
          )}

          {activeSection === 'item-summary' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Item Sales Summary</h2>
              </div>
              {/* Item summary content */}
            </div>
          )}

          {/* Settings Section - Now uses the separate component */}
          {activeSection === 'settings' && <AdminSettings />}
        </div>
      </div>
    </>
  );
}

export default Admin;

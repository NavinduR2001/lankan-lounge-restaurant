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

    // Clear errors if validation passes
    setErrors({});
    
    try {
      console.log("Form is valid. Submitting data:", formData);
      
      // Prepare data for API (handle file upload separately for now)
      const submitData = {
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        foodID: formData.foodID,
        itemPrice: formData.itemPrice,
        itemDescription: formData.itemDescription,
        itemImage: formData.itemImage ? formData.itemImage.name : '', // For now, just send filename
        isTrending: activeSection === 'add-trending' // Set trending based on which form
      };
      
      // ✅ Call the real API
      const response = await addMenuItem(submitData);
      
      console.log('Item added successfully:', response.data);
      
      // Show success message
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
      console.error("Error submitting form:", error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.message || 'Failed to add item';
        setErrors({ submit: errorMessage });
        
        // Handle validation errors from server
        if (error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('itemName')) serverErrors.itemName = err;
            if (err.includes('itemCategory')) serverErrors.itemCategory = err;
            if (err.includes('foodID')) serverErrors.foodID = err;
            if (err.includes('itemPrice')) serverErrors.itemPrice = err;
            if (err.includes('itemDescription')) serverErrors.itemDescription = err;
          });
          setErrors(serverErrors);
        }
      } else if (error.request) {
        // Network error
        setErrors({ submit: "Network error. Please check your connection and try again." });
      } else {
        // Other error
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
            Pending Orders
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

          {/* Other sections remain the same */}
        </div>
      </div>
    </>
  )
}

export default Admin

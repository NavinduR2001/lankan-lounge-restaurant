import React, { useState, useEffect } from 'react'
import './Admin.css'
import AdminNavbar from '../../components/admin-navbar/AdminNavbar'
import AdminSettings from '../admin-setting/AdminSettings'  // ✅ Correct import path
import SalesSummary from '../../components/chart/SalesSummary.jsx';
import ItemSummary from '../../components/item-summary/ItemSummary';
import { IoReloadCircleSharp } from "react-icons/io5";
import { 
  addMenuItem, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder, 
  moveOrderToHistory,      // ✅ New import
  getOrderHistory,         // ✅ New import
  getOrderHistoryStats,
  getAllItems,              // ✅ New import
  deleteItem
} from '../../services/api';
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

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // Add tab state

  // Order history state
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyStats, setHistoryStats] = useState(null);

  // Items state
  const [loadAllItems, setLoadAllItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

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

  // Load orders when orders section is active
  useEffect(() => {
    if (activeSection === 'orders') {
      loadOrders();
    }
  }, [activeSection]);

  // Load order history when history section is active
  useEffect(() => {
    if (activeSection === 'order-history') {
      loadOrderHistory();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'remove-item ') {
      loadAllItems();
    }
  }, [activeSection]);

  // Add this function to load all items
const loadAllItemsData = async () => {
  setLoadingItems(true);
  try {
    const response = await getAllItems();
    console.log('Items response:', response.data);
    
    if (response.data && response.data.items) {
      setLoadAllItems(response.data.items);
    }
  } catch (error) {
    console.error('Error loading items:', error);
    alert('Error loading items. Please try again.');
  } finally {
    setLoadingItems(false);
  }
};

// Add this function to handle item removal
const handleRemoveItem = async (itemId) => {
  const confirmed = window.confirm('Are you sure you want to remove this item? This action cannot be undone.');
  
  if (confirmed) {
    setRemovingItem(itemId);
    try {
      console.log('🗑️ Removing item:', itemId);
      
      const response = await deleteItem(itemId);
      
      if (response.data.success || response.data.message) {
        console.log('✅ Item removed successfully');
        alert('Item removed successfully!');
        
        // Refresh the items list
        loadAllItemsData();
      }
    } catch (error) {
      console.error('❌ Error removing item:', error);
      const errorMessage = error.response?.data?.message || 'Error removing item. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setRemovingItem(null);
    }
  }
};

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await getAllOrders('pending,confirmed,preparing');
      setOrders(response.data.orders);
      console.log('Orders loaded:', response.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // New function to load order history
  const loadOrderHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getOrderHistory({ page: 1, limit: 50 });
      if (response.data.success) {
        setOrderHistory(response.data.data.records);
        console.log('Order history loaded:', response.data.data.records);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    
    if (!formData.itemName || !formData.itemCategory || !formData.itemPrice || !formData.itemDescription || !formData.itemImage) {
      alert('Please fill in all fields and select an image');
      return;
    }

    try {
      setIsSubmitting(true); // ✅ Add loading state
      
      const submitData = new FormData();
      submitData.append('itemName', formData.itemName);
      submitData.append('itemCategory', formData.itemCategory);
      submitData.append('foodID', formData.foodID);
      submitData.append('itemPrice', formData.itemPrice);
      submitData.append('itemDescription', formData.itemDescription);
      submitData.append('image', formData.itemImage);

      console.log('Submitting data:', Object.fromEntries(submitData));

      const response = await addMenuItem(submitData);
      
      // ✅ Fix the response check - your backend sends just 'message', not nested 'success'
      if (response.data && response.data.message) {
        console.log('✅ Menu item added successfully:', response.data);
        
        // ✅ Show success alert
        alert('Menu item added successfully!');
        
        // ✅ Show success message in form
        setSuccessMessage('Menu item added successfully!');
        
        // ✅ Reset form data
        setformData({
          itemName: "",
          itemCategory: "",
          foodID: "",
          itemPrice: "",
          itemDescription: "",
          itemImage: null
        });
        
        // ✅ Clear any existing errors
        setErrors({});
        
        // ✅ Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        // ✅ Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Submission error:', error);
      console.log('Server response:', error.response?.data);
      
      // ✅ Better error handling
      const errorMessage = error.response?.data?.message || 'Error adding menu item. Please try again.';
      alert(`Error: ${errorMessage}`);
      
      // ✅ Set error in form
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false); // ✅ Reset loading state
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

  const handleOrderAction = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      // Reload orders
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Fetch orders for the orders tab
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);



  // Updated handleAccept function
  const handleAccept = async (orderId) => {
    try {
      console.log('🔄 Accepting order (setting to preparing):', orderId);
      
      // Just update status to preparing, don't move to history yet
      const response = await updateOrderStatus(orderId, 'preparing');
      
      if (response.data.success) {
        console.log('✅ Order status updated to preparing');
        loadOrders(); // Refresh the orders list
        alert('Order accepted! Now preparing.');
      }
    } catch (error) {
      console.error('❌ Error accepting order:', error);
      alert('Error accepting order. Please try again.');
    }
  };

  // Update the handleComplete function to move order to history
  const handleComplete = async (orderId) => {
    try {
      console.log('🔄 Completing order and moving to history:', orderId);
      
      const response = await moveOrderToHistory(orderId);
      
      if (response.data.success) {
        console.log('✅ Order completed and moved to history');
        
        // Refresh both orders and history
        loadOrders();
        loadOrderHistory();
        
        alert('Order completed successfully!');
      }
    } catch (error) {
      console.error('❌ Error completing order:', error);
      alert('Error completing order. Please try again.');
    }
  };

  // Update the handleReject function
  const handleReject = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to reject this order? This action cannot be undone.');
    
    if (confirmed) {
      try {
        console.log('🔄 Rejecting order:', orderId);
        
        const response = await deleteOrder(orderId);
        
        if (response.data.success) {
          console.log('✅ Order rejected successfully');
          loadOrders(); // Refresh the orders list
          alert('Order rejected successfully.');
        }
      } catch (error) {
        console.error('❌ Error rejecting order:', error);
        alert('Error rejecting order. Please try again.');
      }
    }
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
         
            <li onClick={() => setActiveSection('remove-item')}>Remove Items</li>
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
            

            <div className="content-container">
              <div className="ad-topic-header">
              <h2 className='Ad-av-header'>Available Orders</h2>
              <button onClick={loadOrders} className="refresh-btn-available"><IoReloadCircleSharp /></button>
            </div>
              {loadingOrders ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length > 0 ? (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Customer Name</th>
                      <th>Contact</th>
                      <th>Order Items</th>
                      <th>Quantities</th>
                      <th>Total Price</th>
                      <th>Pickup Time</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='orders-table-body'>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className='or-table-body-data'>
                          <strong>{order.orderNumber}</strong>
                        </td>
                        <td>{order.customerName || 'N/A'}</td>
                        <td>
                          <div>{order.customerEmail || 'N/A'}</div>
                          <div>{order.customerPhone || 'N/A'}</div>
                        </td>
                        <td>
                          <ul style={{margin: 0, padding: '0 0 0 20px'}}>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <li key={index}>{item.name || 'Unknown Item'}</li>
                              ))
                            ) : (
                              <li>No items</li>
                            )}
                          </ul>
                        </td>
                        <td>
                          <ul style={{margin: 0, padding: '0 0 0 20px'}}>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <li key={index}>{item.quantity || 0}</li>
                              ))
                            ) : (
                              <li>0</li>
                            )}
                          </ul>
                        </td>
                        <td>Rs. {order.totalAmount?.toFixed(2) || '0.00'}</td>
                        <td>
                          <strong>{order.pickupTime || 'N/A'}</strong>
                        </td>
                        <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`status-badge status-${order.status || 'unknown'}`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td>
                          <div className="button-container">
                            {order.status === 'pending' && (
                              <>
                                <button 
                                  className="get-button accept-btn"
                                  onClick={() => handleAccept(order.orderNumber)}
                                >
                                  Accept
                                </button>
                                <button 
                                  className="get-button reject-btn"
                                  onClick={() => handleReject(order.orderNumber)}
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {order.status === 'preparing' && (
                              <button 
                                className="get-button complete-btn"
                                onClick={() => handleComplete(order.orderNumber)}
                              >
                                Complete
                              </button>
                            )}

                            {order.status === 'confirmed' && (
                              <button 
                                className="get-button complete-btn"
                                onClick={() => handleComplete(order.orderNumber)}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-orders">
                  <p>No orders available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order History Section */}
          <div className={`Order-history ${activeSection === 'order-history' ? 'show' : ''}`}>
            

            <div className="content-container">
              <div className="ad-topic-header">
              <h2 className='Ad-av-header'>Order History</h2>
              <button onClick={loadOrderHistory} className="refresh-btn-available"><IoReloadCircleSharp /></button>
            </div>
              {loadingHistory ? (
                <div className="loading">Loading order history...</div>
              ) : orderHistory.length > 0 ? (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Customer Name</th>
                      <th>Contact</th>
                      <th>Order Items</th>
                      <th>Quantities</th>
                      <th>Total Payment</th>
                      <th>Order Date</th>
                      <th>Accepted Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className='orders-table-body'>
                    {orderHistory.map(record => (
                      <tr key={record._id}>
                        <td className='or-table-body-data'>
                          <strong>{record.orderNumber}</strong>
                        </td>
                        <td>{record.customerName}</td>
                        <td>
                          <div>{record.customerEmail || 'N/A'}</div>
                          <div>{record.customerPhone || 'N/A'}</div>
                        </td>
                        <td>
                          <ul style={{margin: 0, padding: '0 0 0 20px'}}>
                            {record.items.map((item, index) => (
                              <li key={index}>{item.name}</li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <ul style={{margin: 0, padding: '0 0 0 20px'}}>
                            {record.items.map((item, index) => (
                              <li key={index}>{item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td>Rs. {record.totalAmount.toFixed(2)}</td>
                        <td>{new Date(record.originalOrderDate).toLocaleDateString()}</td>
                        <td>{new Date(record.acceptedDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${record.finalStatus}`}>
                            {record.finalStatus.charAt(0).toUpperCase() + record.finalStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-orders">
                  <p>No order history available.</p>
                </div>
              )}
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

                    <div className="flex-div-inline">

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
                    
                    </div>

                    
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
              <div className="add-item-form add-focus">
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

                    <div className="add-item-img-input">
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
                    </div>
                    <button type="submit"  disabled={isSubmitting}>
                      {isSubmitting ? 'Adding Trending Item...' : 'Add Trending Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'remove-item' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Remove Menu Items</h2>
                <button onClick={loadAllItemsData} className="refresh-btn">Refresh</button>
              </div>
              
              <div className="load-rem-menu">
                {loadingItems ? (
                  <div className="loading">Loading menu items...</div>
                ) : loadAllItems.length > 0 ? (
                  <table className="rem-menu-table">
                    <thead>
                      <tr>
                        <th>Food ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadAllItems.map(item => (
                        <tr key={item._id}>
                          <td>{item.foodID}</td>
                          <td>{item.itemName}</td>
                          <td>{item.itemCategory}</td>
                          <td>Rs. {item.itemPrice}</td>
                          <td>
                            <button 
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={removingItem === item._id}
                              className="remove-btn"
                            >
                              {removingItem === item._id ? 'Removing...' : 'Remove'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-items">
                    <p>No menu items found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Sales Summary Section */}
          {activeSection === 'sales-summary' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Sales Summary Report</h2>
              </div>
              <SalesSummary />
            </div>
          )}

          {/* Item Summary Section */}
          {activeSection === 'item-summary' && (
            <div className="section-content">
              <div className="ad-topic-header">
                <h2 className='Ad-av-header'>Item Sales Summary</h2>
              </div>
              <ItemSummary />
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

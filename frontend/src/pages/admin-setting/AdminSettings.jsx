import React, { useState, useEffect } from 'react';
import './AdminSettings.css';
import { updateMainAdminProfile } from '../../services/api';

function AdminSettings() {
  // Main admin profile state
  const [mainAdminData, setMainAdminData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Restaurant settings state
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurantName: 'Gami Gedara Restaurant',
    address: '123 Main Street, Colombo 07, Sri Lanka',
    phoneNumber: '+94 11 234 5678',
    email: 'info@gamigedara.lk',
    openTime: '08:00',
    closeTime: '22:00',
    discountRate: '10',
    serviceFeeRate: '10'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load admin data on component mount
  useEffect(() => {
    const initializeComponent = () => {
      try {
        const admin = localStorage.getItem('admin');
        const token = localStorage.getItem('token');
        
        if (!admin || !token) {
          console.log('No admin data found, but letting parent handle auth');
          return;
        }
        
        const parsedAdmin = JSON.parse(admin);
        
        setMainAdminData(prev => ({
          ...prev,
          displayName: parsedAdmin.displayName || '',
          email: parsedAdmin.email || ''
        }));
        
      } catch (error) {
        console.error('Error initializing settings:', error);
        setError('Failed to load admin data');
      }
    };
    
    initializeComponent();
  }, []);

  // Handle main admin profile update
  const handleMainAdminUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Validate passwords match if changing password
      if (mainAdminData.newPassword && mainAdminData.newPassword !== mainAdminData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password strength if changing password
      if (mainAdminData.newPassword && mainAdminData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const updateData = {
        displayName: mainAdminData.displayName,
        email: mainAdminData.email
      };

      // Only add password fields if user wants to change password
      if (mainAdminData.newPassword) {
        updateData.currentPassword = mainAdminData.currentPassword;
        updateData.newPassword = mainAdminData.newPassword;
      }

      console.log('🔄 Submitting admin update:', updateData);

      const response = await updateMainAdminProfile(updateData);
      
      console.log('✅ Update response:', response.data);
      
      // ✅ Check response properly - your backend sends 'message' directly
      if (response.data && response.data.message) {
        // ✅ Show success alert
        alert('Admin profile updated successfully!');
        
        // ✅ Show success message in form
        setMessage('Admin profile updated successfully!');
        
        // ✅ Update localStorage with new admin data
        try {
          const currentAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
          const updatedAdminData = {
            ...currentAdmin,
            displayName: response.data.admin.displayName,
            email: response.data.admin.email
          };
          localStorage.setItem('admin', JSON.stringify(updatedAdminData));
          console.log('✅ localStorage updated with new admin data');
        } catch (storageError) {
          console.error('❌ Error updating localStorage:', storageError);
        }

        // ✅ Clear password fields after successful update
        setMainAdminData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // ✅ Clear success message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
        
        // ✅ Optionally reload the page to show updated data
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);

      } else {
        // Handle unexpected response format
        console.warn('⚠️ Unexpected response format:', response.data);
        setError('Profile updated but response format was unexpected');
      }

    } catch (error) {
      console.error('❌ Error updating admin profile:', error);
      
      // ✅ Better error handling
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      
      // ✅ Show error alert
      alert(`Error: ${errorMessage}`);
      
      // ✅ Set error message in form
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle restaurant settings update
  const handleRestaurantSettingsUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // In a real app, you'd save these to your backend
      // For now, we'll just show a success message
      setTimeout(() => {
        setMessage('Restaurant settings updated successfully!');
        setLoading(false);
      }, 1000);
    } catch {
      setError('Failed to update restaurant settings');
      setLoading(false);
    }
  };

  // Handle restaurant settings input changes
  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle admin input changes
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setMainAdminData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (message) setMessage('');
    if (error) setError('');
  };

  return (
    <div className="section-content">
      <div className="ad-topic-header">
        <h2 className='Ad-av-header'>Restaurant Settings</h2>
      </div>

      <div className="settings-container">
        {/* Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Restaurant Information */}
        <div className="settings-section">
          <h3>🏪 Restaurant Information</h3>
          <form onSubmit={handleRestaurantSettingsUpdate}>
            <div className="form-group">
              <label htmlFor="restaurantName">Restaurant Name:</label>
              <input 
                type="text" 
                id="restaurantName"
                name="restaurantName"
                value={restaurantSettings.restaurantName}
                onChange={handleRestaurantInputChange}
                className="settings-input" 
                required
              />
              
              <label htmlFor="address">Address:</label>
              <textarea 
                id="address"
                name="address"
                className="settings-input" 
                value={restaurantSettings.address}
                onChange={handleRestaurantInputChange}
                rows="3"
                required
              ></textarea>
              
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input 
                type="tel" 
                id="phoneNumber"
                name="phoneNumber"
                value={restaurantSettings.phoneNumber}
                onChange={handleRestaurantInputChange}
                className="settings-input" 
                required
              />
              
              <label htmlFor="restaurantEmail">Email:</label>
              <input 
                type="email" 
                id="restaurantEmail"
                name="email"
                value={restaurantSettings.email}
                onChange={handleRestaurantInputChange}
                className="settings-input" 
                required
              />
              
              <label>Operating Hours:</label>
              <div className="time-inputs">
                <input 
                  type="time" 
                  name="openTime"
                  value={restaurantSettings.openTime}
                  onChange={handleRestaurantInputChange}
                  className="settings-input small" 
                />
                <span>to</span>
                <input 
                  type="time" 
                  name="closeTime"
                  value={restaurantSettings.closeTime}
                  onChange={handleRestaurantInputChange}
                  className="settings-input small" 
                />
              </div>

              <button type="submit" className="settings-btn save" disabled={loading}>
                {loading ? 'Updating...' : 'Update Restaurant Info'}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Profile Management */}
        <div className="settings-section">
          <h3>🔐 Admin Profile</h3>
          <form onSubmit={handleMainAdminUpdate}>
            <div className="form-group">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="displayName">Display Name:</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={mainAdminData.displayName}
                    onChange={handleAdminInputChange}
                    className="settings-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="adminEmail">Email:</label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="email"
                    value={mainAdminData.email}
                    onChange={handleAdminInputChange}
                    className="settings-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="currentPassword">Current Password:</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={mainAdminData.currentPassword}
                    onChange={handleAdminInputChange}
                    className="settings-input"
                    placeholder="Enter current password to change password"
                  />
                  <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    Required only if you want to change your password
                  </small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={mainAdminData.newPassword}
                    onChange={handleAdminInputChange}
                    className="settings-input"
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={mainAdminData.confirmPassword}
                    onChange={handleAdminInputChange}
                    className="settings-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button type="submit" className="settings-btn save" disabled={loading}>
                {loading ? 'Updating...' : 'Update Admin Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Settings */}
        <div className="settings-section">
          <h3>💰 Order Settings</h3>
          <form onSubmit={handleRestaurantSettingsUpdate}>
            <div className="form-group">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="discountRate">Default Discount Rate (%):</label>
                  <input 
                    type="number" 
                    id="discountRate"
                    name="discountRate"
                    value={restaurantSettings.discountRate}
                    onChange={handleRestaurantInputChange}
                    className="settings-input" 
                    min="0" 
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="serviceFeeRate">Service Fee Rate (%):</label>
                  <input 
                    type="number" 
                    id="serviceFeeRate"
                    name="serviceFeeRate"
                    value={restaurantSettings.serviceFeeRate}
                    onChange={handleRestaurantInputChange}
                    className="settings-input" 
                    min="0" 
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <button type="submit" className="settings-btn save" disabled={loading}>
                {loading ? 'Updating...' : 'Update Order Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
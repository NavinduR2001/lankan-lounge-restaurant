import React, { useState, useEffect } from 'react'
import './Cart.css'
import Navbar from '../../components/navbar/Navbar'
import { FiMinus, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/CartContext'; 
import { one } from '../../assets/assets'; 
import { createOrder } from '../../services/api';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotals, clearCart, loading, isLoggedIn } = useCart();
  
  const { subtotal, serviceFee, discount, total, itemCount } = getCartTotals();
  const [time, setTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    let startHour = currentHour;
    let startMinute = currentMinute <= 30 ? 30 : 60;
    
    if (startMinute === 60) {
      startHour += 1;
      startMinute = 0;
    }
    
    for (let hour = startHour; hour <= 23; hour++) {
      const startMin = (hour === startHour) ? startMinute : 0;
      for (let minute = startMin; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
    if (error) setError('');
  };

  const handleProceedToCheckout = async () => {
    setError('');
    
    // Validation
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!time) {
      setError('Please select a pickup time');
      return;
    }

    setIsProcessing(true);

    try {
      // Get user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Prepare order data
      const orderData = {
        customerName: userData.name || 'Guest User',
        customerEmail: userData.email || '',
        customerPhone: userData.contactNumber || '',
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        pickupTime: time,
        paymentMethod: 'Cash on Pickup', // Since payment is implemented later
        status: 'pending'
      };

      console.log('🔄 Creating order:', orderData);

      // Create order
      const response = await createOrder(orderData);
      
      if (response.data.success) {
        console.log('✅ Order created successfully');
        
        // Clear cart after successful order
        await clearCart();
        
        // Show success message
        alert(`Order placed successfully! Order Number: ${response.data.order.orderNumber}\nYour order will be ready for pickup at ${time}`);
        
        // Reset form
        setTime('');
        
        // Stay on cart page as requested
        // Cart will be empty now
        
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('❌ Order creation error:', error);
      
      if (error.response?.status === 401) {
        setError('Please login to place an order');
        navigate('/login');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = (foodID, change) => {
    const item = cartItems.find(item => item.foodID === foodID);
    if (item) {
      updateQuantity(foodID, item.quantity + change);
    }
  };

  const handleRemoveItem = (foodID) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      removeFromCart(foodID);
    }
  };

  // Show loading while checking auth or processing
  if (loading || !isLoggedIn) {
    return (
      <div className='cart-page'>
        <Navbar/>
        <div className="cart-page-container">
          <div className="loading-container">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='cart-page'>
      <Navbar/>
      
      <div className="cart-page-container">
        <div className="my-cart">
          <div className="cart-header">
            <div className="line-cart">
              <div className="line cartline"></div>
              <h2 className='cart-subtitle'>My Cart</h2>
              <div className="line cartline"></div>
            </div>
          </div>

          {error && (
            <div className="cart-error-message">
              {error}
            </div>
          )}

          <div className="cart-item-container">
            {cartItems.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.foodID} className={`cart-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                      <td className="item-cell">
                        <div className="item-info">
                          <img 
                            src={item.image ? `http://localhost:5000/${item.image}` : one} 
                            alt={item.name} 
                            className="item-image"
                            onError={(e) => {
                              e.target.src = one;
                            }}
                          />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-id">ID: {item.foodID}</span>
                          </div>
                        </div>
                      </td>
                      <td className="serving-cell">{item.category}</td>
                      <td className="price-cell">Rs. {item.price.toFixed(2)}</td>
                      <td className="quantity-cell">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn minus"
                            onClick={() => handleQuantityChange(item.foodID, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className="quantity-number">{item.quantity}</span>
                          <button 
                            className="quantity-btn plus"
                            onClick={() => handleQuantityChange(item.foodID, 1)}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </td>
                      <td className="total-cell">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                      <td className="action-cell">
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.foodID)}
                          title="Remove from cart"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button 
                  className="continue-shopping-btn" 
                  onClick={() => navigate('/menu')}
                >
                  Browse Menu
                </button>
              </div>
            )}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Service Fee</span>
                <span>Rs. {serviceFee.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Discount</span>
                <span>- Rs. {discount.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="time-wrapper">
              <label className="time-label">
                Select pickup time: *
                <select
                  value={time}
                  onChange={handleTimeChange}
                  className="time-input"
                  required
                >
                  <option value="">Choose time</option>
                  {generateTimeSlots().map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      Today {timeSlot}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="checkout-section">
              <button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
                disabled={isProcessing || !time}
              >
                {isProcessing ? 'Processing Order...' : 'Proceed to Checkout'}
              </button>
              
              <button 
                className="continue-shopping-btn" 
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
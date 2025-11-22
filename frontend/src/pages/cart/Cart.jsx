import React, { useState, useEffect } from 'react'
import './Cart.css'
import Navbar from '../../components/navbar/Navbar'
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
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

  // Enhanced helper function with better formatting
const getPickupTimeRange = (selectedTime) => {
  if (!selectedTime) return null;
  
  const [hours, minutes] = selectedTime.split(':').map(Number);
  
  // Calculate end time (1 hour later)
  let endHour = hours + 1;
  let endMinute = minutes;
  
  // Handle day overflow
  if (endHour >= 24) {
    endHour = endHour - 24;
  }
  
  // Format times in 12-hour format with AM/PM
  const formatTime12Hour = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  return {
    startTime: formatTime12Hour(hours, minutes),
    endTime: formatTime12Hour(endHour, endMinute),
    startTime24: selectedTime,
    endTime24: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
  };
};



  const makeProceedToCheckout = async() => {
    // ✅ Validation first
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!time) {
      setError('Please select a pickup time');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('🔄 Starting checkout process...');

      // ✅ Prepare products with correct image format
      const products = cartItems.map(item => {
        console.log('🔍 Item image path:', item.image);
        
        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          description: item.description || item.itemDescription
        };
      });

      console.log('📦 Products prepared:', products);

      // ✅ Calculate final total with service fee and discount
      const finalTotal = subtotal + serviceFee - discount;
      
      console.log('💰 Price breakdown:', {
        subtotal: subtotal,
        serviceFee: serviceFee,
        discount: discount,
        finalTotal: finalTotal
      });

      const body = {
        products: products,
        totalAmount: finalTotal,  // ✅ Send final total (not just subtotal)
        pickupTime: time
      };

      console.log('📤 Checkout body:', body);

      // ✅ Get token
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to continue');
      }

      console.log('📤 Sending request to create checkout session...');

      // ✅ Create checkout session
      const response = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const session = await response.json();
      console.log('✅ Session created:', session);

      if (!session.url) {
        throw new Error('Invalid session response - no checkout URL');
      }
      
      console.log('🔄 Redirecting to Stripe checkout URL:', session.url);

      // ✅ Direct redirect using session.url
      window.location.href = session.url;
      
    } catch (error) {
      console.error('❌ Checkout error:', error);
      setError(error.message || 'Payment process failed. Please try again.');
      setIsProcessing(false);
    }
    // Don't set isProcessing to false here since we're redirecting
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
                          className="remove-btn-cart"
                          onClick={() => handleRemoveItem(item.foodID)}
                          title="Remove from cart"
                        >
                          <MdDelete />
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
                  className="continue-shopping-btn-empty" 
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
  <div className="time-selection">
    <label htmlFor="pickup-time" className="time-label">
      Select pickup time for today
    </label>
    <select
      id="pickup-time"
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
  </div>
  
  {time && (
    <div className="pickup-info">
      <h3 className="pickup-note">
        Pickup Time Range <br />
        <strong>{getPickupTimeRange(time)?.startTime} - {getPickupTimeRange(time)?.endTime}</strong>
      </h3>
      <p className="pickup-instruction">
        Please arrive between this time to collect your order. Otherwise order may be <b>canceled</b>.
      </p>
    </div>
  )}
</div>
            
            <div className="checkout-section">
              <button 
                className="checkout-btn"
                onClick={makeProceedToCheckout}
                disabled={isProcessing || !time}
              >
                {isProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
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
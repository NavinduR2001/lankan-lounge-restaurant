import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../components/CartContext';
import { createOrder } from '../../services/api';
import './Payment.css';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else {
      setStatus('error');
      setError('No session ID found');
    }
  }, [searchParams]);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      console.log('✅ Payment successful, session ID:', sessionId);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🔍 Verifying payment session...');

      const response = await fetch(`http://localhost:5000/api/verify-payment-session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment session');
      }

      const sessionData = await response.json();
      console.log('📦 Session data retrieved:', sessionData);
      console.log('🛒 Items from backend:', sessionData.items);

      const items = sessionData.items;

      if (!items || items.length === 0) {
        throw new Error('No items found in order');
      }

      console.log('✅ Items ready for order:', items);

      const orderPayload = {
        customerName: sessionData.metadata.customerName,
        customerEmail: sessionData.metadata.customerEmail,
        customerPhone: sessionData.metadata.customerPhone,
        items: items,
        totalAmount: parseFloat(sessionData.metadata.totalAmount),
        pickupTime: sessionData.metadata.pickupTime,
        paymentMethod: 'Card (Stripe)',
        paymentStatus: 'paid',
        stripeSessionId: sessionId,
        status: 'pending'
      };

      console.log('📤 Creating order with payload:', orderPayload);

      const orderResponse = await createOrder(orderPayload);
      
      console.log('📥 Order response:', orderResponse);

      if (orderResponse.data && orderResponse.data.success) {
        console.log('✅ Order created successfully:', orderResponse.data.order);
        const createdOrder = orderResponse.data.order;
        
        setOrderDetails(createdOrder);
        setStatus('success');
        
        await clearCart();
        console.log('🗑️ Cart cleared');
        
        const checkoutOrderData = {
          orderNumber: createdOrder.orderNumber,
          customerName: createdOrder.customerName,
          customerEmail: createdOrder.customerEmail,
          customerPhone: createdOrder.customerPhone,
          totalAmount: createdOrder.totalAmount,
          pickupTime: createdOrder.pickupTime,
          items: createdOrder.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          orderDate: new Date(createdOrder.createdAt || createdOrder.orderDate).toLocaleDateString(),
          orderTime: new Date(createdOrder.createdAt || createdOrder.orderDate).toLocaleTimeString(),
          status: createdOrder.status
        };

        console.log('📋 Prepared checkout data:', checkoutOrderData);
        
        setTimeout(() => {
          navigate('/checkout', { 
            state: { 
              orderData: checkoutOrderData
            }
          });
        }, 3000);
      } else {
        throw new Error(orderResponse.data?.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Error processing payment success:', error);
      setStatus('error');
      setError(error.message || 'An error occurred while processing your payment');
    }
  };

  if (status === 'processing') {
    return (
      <div className="payment-success-wrapper">
        <div className="payment-success-container">
          <div className="payment-verification-card scroll-animate fade-in">
            <div className="payment-loader-ring">
              <div className="payment-loader-inner"></div>
            </div>
            <h2 className="payment-verification-title">Processing Your Payment</h2>
            <p className="payment-verification-text">Please wait while we confirm your order...</p>
            <p className="payment-verification-note">Do not close or refresh this window</p>
            <div className="payment-dots-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="payment-success-wrapper">
        <div className="payment-success-container">
          <div className="payment-error-card scroll-animate fade-in">
            <div className="payment-error-icon-wrapper">
              <div className="payment-error-icon">✕</div>
            </div>
            <h1 className="payment-error-title">Payment Verification Failed</h1>
            <p className="payment-error-message">{error || 'Something went wrong with your payment.'}</p>
            <div className="payment-error-divider"></div>
            <div className="payment-error-actions">
              <button onClick={() => navigate('/cart')} className="payment-retry-btn">
                <span>Return to Cart</span>
              </button>
              <button onClick={() => navigate('/menu')} className="payment-menu-btn">
                <span>Browse Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="payment-success-wrapper">
        <div className="payment-success-container">
          <div className="payment-confirmed-card scroll-animate scale-in">
            <div className="payment-success-checkmark-wrapper">
              <div className="payment-success-checkmark">
                <svg className="payment-checkmark-svg" viewBox="0 0 52 52">
                  <circle className="payment-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="payment-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            
            <h1 className="payment-success-title">Payment Successful!</h1>
            <p className="payment-success-subtitle">Your order has been confirmed and payment received</p>
            
            {orderDetails && (
              <div className="payment-order-summary">
                <div className="payment-summary-header">
                  <h3>Order Summary</h3>
                </div>
                <div className="payment-summary-content">
                  <div className="payment-summary-row">
                    <span className="payment-summary-label">Order Number</span>
                    <span className="payment-summary-value payment-order-number">{orderDetails.orderNumber}</span>
                  </div>
                  <div className="payment-summary-divider"></div>
                  <div className="payment-summary-row">
                    <span className="payment-summary-label">Total Amount</span>
                    <span className="payment-summary-value payment-amount">Rs. {orderDetails.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="payment-summary-divider"></div>
                  <div className="payment-summary-row">
                    <span className="payment-summary-label">Pickup Time</span>
                    <span className="payment-summary-value payment-pickup-time">{orderDetails.pickupTime}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="payment-redirect-section">
              <div className="payment-redirect-icon">
                <svg className="payment-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <p className="payment-redirect-message">Redirecting to download your order token...</p>
              <div className="payment-progress-bar">
                <div className="payment-progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default PaymentSuccess;
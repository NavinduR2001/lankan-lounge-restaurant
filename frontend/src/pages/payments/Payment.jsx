import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';
import Navbar from '../../components/navbar/Navbar';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data passed from checkout
  const orderData = location.state?.orderData || {};
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardType, setCardType] = useState('');

  // Card type detection
  const detectCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (num.match(/^4/)) return 'visa';
    if (num.match(/^5[1-5]/)) return 'mastercard';
    if (num.match(/^3[47]/)) return 'amex';
    return '';
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (name === 'cardHolderName') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation
    const cardNum = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNum) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNum.length < 13 || cardNum.length > 19) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Cardholder name validation
    if (!paymentData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    } else if (paymentData.cardHolderName.trim().length < 2) {
      newErrors.cardHolderName = 'Name too short';
    }

    // Billing address validation
    if (!paymentData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!paymentData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!paymentData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // On successful payment, navigate to success page
      navigate('/payment-success', {
        state: {
          orderData,
          paymentData: {
            ...paymentData,
            cardNumber: '**** **** **** ' + paymentData.cardNumber.slice(-4)
          }
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳 VISA';
      case 'mastercard':
        return '💳 MC';
      case 'amex':
        return '💳 AMEX';
      default:
        return '💳';
    }
  };

  return (
    <div className="payment-page">
      <Navbar />
      
      <div className="payment-container">
        <div className="payment-content">
          {/* Order Summary */}
          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Order #{orderData.orderNumber || 'N/A'}</span>
              </div>
              <div className="summary-row">
                <span>Customer: {orderData.customerName || 'N/A'}</span>
              </div>
              <div className="summary-row">
                <span>Pickup: {orderData.pickupTime || 'N/A'}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="amount">Rs. {orderData.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-card">
            <div className="payment-header">
              <h2>Payment Details</h2>
              <div className="accepted-cards">
                <span>We accept:</span>
                <div className="card-icons">
                  <span className="card-icon visa">VISA</span>
                  <span className="card-icon mastercard">MC</span>
                  <span className="card-icon amex">AMEX</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              {/* Card Information */}
              <div className="form-section">
                <h3>Card Information</h3>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <div className="card-input-wrapper">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    <span className="card-type-icon">{getCardIcon()}</span>
                  </div>
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cardHolderName">Cardholder Name *</label>
                  <input
                    type="text"
                    id="cardHolderName"
                    name="cardHolderName"
                    value={paymentData.cardHolderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={errors.cardHolderName ? 'error' : ''}
                  />
                  {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
                </div>
              </div>

              {/* Billing Address */}
              <div className="form-section">
                <h3>Billing Address</h3>
                
                <div className="form-group">
                  <label htmlFor="billingAddress">Address *</label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={paymentData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className={errors.billingAddress ? 'error' : ''}
                  />
                  {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={paymentData.city}
                      onChange={handleInputChange}
                      placeholder="Colombo"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={paymentData.postalCode}
                      onChange={handleInputChange}
                      placeholder="10000"
                      className={errors.postalCode ? 'error' : ''}
                    />
                    {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={paymentData.country}
                    onChange={handleInputChange}
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="Maldives">Maldives</option>
                  </select>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="payment-actions">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="back-btn"
                  disabled={isProcessing}
                >
                  ← Back to Checkout
                </button>

                <button
                  type="submit"
                  className="pay-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    `Pay Rs. ${orderData.totalAmount?.toFixed(2) || '0.00'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <div className="security-text">
            <h4>Secure Payment</h4>
            <p>Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
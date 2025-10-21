import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';
import jsPDF from 'jspdf';
import Navbar from '../../components/navbar/Navbar';
import { IoDocumentTextSharp } from "react-icons/io5";
import { TbPinFilled } from "react-icons/tb";


function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data passed from Cart
  const orderData = location.state?.orderData || {};
  
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Redirect if no order data
  useEffect(() => {
    if (!orderData.orderNumber) {
      navigate('/cart');
    }
  }, [orderData, navigate]);

  const generateOrderToken = () => {
    return {
      orderNumber: orderData.orderNumber || 'ORD-UNKNOWN',
      customerName: orderData.customerName || 'Guest User',
      customerEmail: orderData.customerEmail || 'N/A',
      customerPhone: orderData.customerPhone || 'N/A',
      orderDate: new Date().toLocaleDateString(),
      orderTime: new Date().toLocaleTimeString(),
      pickupTime: orderData.pickupTime || 'N/A',
      totalAmount: `Rs. ${orderData.totalAmount?.toFixed(2) || '0.00'}`,
      items: orderData.items || [],
      status: 'Confirmed',
      instructions: 'Please present this token at pickup counter'
    };
  };

  const token = generateOrderToken();

  const handleDownloadPDF = () => {
    // Create a smaller PDF (receipt size: 80mm width, auto height)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200]
    });
    
    const margin = 5;
    const pageWidth = 80;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPos = 8;
    
    // Restaurant header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('LANKAN LOUNGE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFontSize(12);
    doc.text('RESTAURANT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    // Contact info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Tel: 077-123-4567', pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    doc.text('www.lankanlounge.com', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    // Separator line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
    
    // Order token title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ORDER TOKEN', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    // Order number
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(margin, yPos - 3, contentWidth, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`ORDER: ${token.orderNumber}`, pageWidth / 2, yPos + 1, { align: 'center' });
    yPos += 12;
    
    // Customer info section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('CUSTOMER DETAILS', margin, yPos);
    yPos += 2;
    
    // Underline
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, margin + 35, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Name: ${token.customerName}`, margin, yPos);
    yPos += 4;
    doc.text(`Phone: ${token.customerPhone}`, margin, yPos);
    yPos += 4;
    
    // Truncate email if too long
    const email = token.customerEmail.length > 25 ? 
      token.customerEmail.substring(0, 22) + '...' : token.customerEmail;
    doc.text(`Email: ${email}`, margin, yPos);
    yPos += 8;
    
    // Order details section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ORDER DETAILS', margin, yPos);
    yPos += 2;
    
    // Underline
    doc.line(margin, yPos, margin + 30, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Date: ${token.orderDate}`, margin, yPos);
    yPos += 4;
    doc.text(`Time: ${token.orderTime}`, margin, yPos);
    yPos += 4;
    
    // Pickup time - make it stand out with box
    doc.setFont('helvetica', 'bold');
    doc.rect(margin, yPos - 2, contentWidth, 6);
    doc.text(`PICKUP: ${token.pickupTime}`, pageWidth / 2, yPos + 1, { align: 'center' });
    yPos += 10;
    
    // Items section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ITEMS ORDERED', margin, yPos);
    yPos += 2;
    
    // Underline
    doc.line(margin, yPos, margin + 30, yPos);
    yPos += 5;
    
    // Items header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('Item', margin, yPos);
    doc.text('Qty', margin + 40, yPos);
    doc.text('Amount', margin + 55, yPos);
    yPos += 2;
    
    // Header line
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    // Items list
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    
    token.items.forEach((item, index) => {
      const itemName = item.name.length > 18 ? item.name.substring(0, 15) + '...' : item.name;
      const itemTotal = item.price * item.quantity;
      
      doc.text(`${index + 1}. ${itemName}`, margin, yPos);
      doc.text(`${item.quantity}`, margin + 42, yPos);
      doc.text(`Rs.${itemTotal.toFixed(2)}`, margin + 55, yPos);
      yPos += 3;
    });
    
    yPos += 2;
    
    // Total section
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL AMOUNT:', margin, yPos);
    doc.text(token.totalAmount, pageWidth - margin, yPos, { align: 'right' });
    yPos += 2;
    
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    // Status
    doc.rect(margin, yPos - 2, contentWidth, 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('STATUS: CONFIRMED', pageWidth / 2, yPos + 1, { align: 'center' });
    yPos += 10;
    
    // Verification section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('VERIFICATION CODE', margin, yPos);
    yPos += 3;
    
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.rect(margin, yPos - 2, contentWidth, 8);
    doc.text(token.orderNumber.replace('ORD-', ''), pageWidth / 2, yPos + 2, { align: 'center' });
    yPos += 12;
    
    // Instructions
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('IMPORTANT NOTES', margin, yPos);
    yPos += 4;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const instructions = [
      '1. Present this token at pickup',
      '2. Arrive within pickup time',
      '3. Cancel 1 hour before: Call 077-123-4567',
      '4. Order auto-cancelled if late'
    ];
    
    instructions.forEach(instruction => {
      doc.text(instruction, margin, yPos);
      yPos += 3;
    });
    
    yPos += 3;
    
    // Footer
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 3;
    doc.text('THANK YOU FOR CHOOSING', pageWidth / 2, yPos, { align: 'center' });
    yPos += 2;
    doc.text('LANKAN LOUNGE RESTAURANT', pageWidth / 2, yPos, { align: 'center' });
    
    // Save the PDF
    doc.save(`Lankan-Lounge-Token-${token.orderNumber}.pdf`);
    setIsDownloaded(true);
  };

  const handleConfirmOrder = async () => {
    if (!isDownloaded) {
      alert('Please download your order token first');
      return;
    }
    
    if (!isTermsAccepted) {
      alert('Please accept the terms and conditions to proceed');
      return;
    }

    setIsConfirming(true);
    
    // Simulate order confirmation process
    setTimeout(() => {
      alert('Order confirmed successfully! You will receive a confirmation email shortly.');
      navigate('/menu'); // Redirect to menu or home
    }, 2000);
  };

  if (!orderData.orderNumber) {
    return (
      <div className="checkout-page">
        {/* <Navbar /> */}
        <div className="checkout-container">
          <div className="error-message">
            <h2>No Order Found</h2>
            <p>Please place an order first.</p>
            <button onClick={() => navigate('/cart')} className="back-btn">
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* <Navbar /> */}
      
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Order Confirmation</h1>
         
        </div>

        {/* Order Token Section */}
        <div className="order-token-section">
          <div className="token-header">
            <h2><IoDocumentTextSharp /> Order Token</h2>
            <span className={`download-status ${isDownloaded ? 'downloaded' : 'pending'}`}>
              {isDownloaded ? '✅ Downloaded' : '⏳ Pending Download'}
            </span>
          </div>
          
          <div className="token-details">
            <div className="token-grid">
              <div className="token-item">
                <label>Order Number:</label>
                <span className="token-number">{token.orderNumber}</span>
              </div>
              
              <div className="token-item">
                <label>Customer Name:</label>
                <span>{token.customerName}</span>
              </div>
              
              <div className="token-item">
                <label>Email:</label>
                <span>{token.customerEmail}</span>
              </div>
              
              <div className="token-item">
                <label>Phone:</label>
                <span>{token.customerPhone}</span>
              </div>
              
              <div className="token-item">
                <label>Order Date:</label>
                <span>{token.orderDate}</span>
              </div>
              
              <div className="token-item">
                <label>Pickup Time:</label>
                <span className="pickup-time">{token.pickupTime}</span>
              </div>
              
              <div className="token-item total-amount">
                <label>Total Amount:</label>
                <span>{token.totalAmount}</span>
              </div>
            </div>
            
            <div className="order-items">
              <h3>Order Items:</h3>
              <ul>
                {token.items.map((item, index) => (
                  <li key={index}>
                    <span className="item-name">{item.name}</span>
                    <span className="item-details">Qty: {item.quantity} × Rs. {item.price.toFixed(2)}</span>
                    <span className="item-total">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="download-section">
            <button 
              className={`download-btn ${isDownloaded ? 'downloaded' : ''}`}
              onClick={handleDownloadPDF}
            >
              {isDownloaded ? 'Token Downloaded' : 'Download Order Token'}
            </button>
            <p className="download-note">
              Save this token and present it at the pickup counter
            </p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <h2><TbPinFilled /> Terms & Conditions</h2>
          <div className="terms-content">
            <div className="terms-list">
              <div className="term-item">
                {/* <span className="term-icon"><FaClockRotateLeft /></span> */}
                <div className="term-text">
                  <ul>
                    
                    <li className='checkout-list'>
                      <strong>Pickup Time:</strong> Please arrive within your scheduled pickup time window. 
                      Late arrivals may result in order cancellation.
                    </li>
                    <li className='checkout-list'> <strong>Auto-Cancellation:</strong> Orders not picked up within 30 minutes of the scheduled time will be automatically cancelled.
                  </li>
                    <li className='checkout-list'>
                      <strong>Manual Cancellation:</strong> You can cancel  order by calling our 
                      hotline <strong>(077) 123-4567</strong> at least 1 hour before your pickup time.
                    </li>
                    <li className='checkout-list'>   <strong>Order Token:</strong> Please present    your downloaded order token 
                     at the pickup counter for order verification.
                  </li>
                  <li className='checkout-list'> <strong>Payment:</strong> Payment will be collected at the time of pickup. 
                  We accept cash and card payments.</li>

                  </ul>
                  
                  
                </div>
              </div>
              
           
            

            </div>
          </div>
          
          <div className="terms-agreement">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="agreement-text">
                I have read and agree to the terms and conditions above
              </span>
            </label>
          </div>
        </div>

        {/* Confirmation Section */}
        <div className="confirmation-section">
          <div className="confirmation-checklist">
            <div className={`checklist-item ${isDownloaded ? 'completed' : 'pending'}`}>
              <span className="check-icon">{isDownloaded ? '✅' : '⏳'}</span>
              <span>Download Order Token</span>
            </div>
            <div className={`checklist-item ${isTermsAccepted ? 'completed' : 'pending'}`}>
              <span className="check-icon">{isTermsAccepted ? '✅' : '⏳'}</span>
              <span>Accept Terms & Conditions</span>
            </div>
          </div>
          
          <div className="confirmation-actions">
             <button 
              className="back-btn-checkout"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>

            <button 
              className="confirm-btn-checkout"
              onClick={handleConfirmOrder}
              disabled={!isDownloaded || !isTermsAccepted || isConfirming}
            >
              {isConfirming ? 'Confirming Order...' : 'Confirm Order'}
            </button>
            
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
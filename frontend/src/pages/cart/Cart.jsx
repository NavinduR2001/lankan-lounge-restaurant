import React, { useState } from 'react'
import './Cart.css'
import Navbar from '../../components/Navbar/Navbar'
import { IoChevronBackCircle } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Spicy Chicken Biriyani",
      person: "1 person",
      price: 2500,
      quantity: 1,
      image: "/api/placeholder/60/60"
    },
    {
      id: 2,
      name: "Cheese Pizza (Large)",
      person: "2-3 persons",
      price: 3200,
      quantity: 1,
      image: "/api/placeholder/60/60"
    },
    {
      id: 3,
      name: "Grilled Chicken Burger",
      person: "1 person",
      price: 1800,
      quantity: 1,
      image: "/api/placeholder/60/60"
    },
    {
      id: 4,
      name: "Seafood Fried Rice",
      person: "1 person",
      price: 2200,
      quantity: 1,
      image: "/api/placeholder/60/60"
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getServiceFee = () =>{
    if(getSubtotal() >= 50000){
        return 0;
  } else{
      return Math.round(getSubtotal() * 0.05);
  }
};

  const getDiscount = () => {
  const subtotal = getSubtotal();
  if (subtotal >= 10000) {
    return Math.round(subtotal * 0.01); 
  } else if (subtotal >= 25000) {
    return Math.round(subtotal * 0.1); 
  } else {
    return 0;
  }
};
  const getTotal = () => getSubtotal() + getServiceFee() - getDiscount();

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

          <div className="cart-item-container">
            {cartItems.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Serving</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.id} className={`cart-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                      <td className="item-cell">
                        <div className="item-info">
                          <img src={item.image} alt={item.name} className="item-image" />
                          <span className="item-name">{item.name}</span>
                        </div>
                      </td>
                      <td className="serving-cell">{item.person}</td>
                      <td className="price-cell">Rs. {item.price.toLocaleString()}.00</td>
                      <td className="quantity-cell">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn minus"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className="quantity-number">{item.quantity}</span>
                          <button 
                            className="quantity-btn plus"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </td>
                      <td className="total-cell">Rs. {(item.price * item.quantity).toLocaleString()}.00</td>
                      <td className="action-cell">
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
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
              </div>
            )}
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h3>Order Summary</h3>
          </div>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>Rs. {getSubtotal().toLocaleString()}.00</span>
            </div>
            
            <div className="summary-row">
              <span>Service Fee</span>
              <span>Rs. {getServiceFee().toLocaleString()}.00</span>
            </div>
            
            <div className="summary-row">
              <span>Discount</span>
              <span>Rs. {getDiscount().toLocaleString()}.00</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span>Rs. {getTotal().toLocaleString()}.00</span>
            </div>
          </div>
          
          <div className="checkout-section">
            <button className="checkout-btn">
              Proceed to Checkout
            </button>
            
            {/* <button className="continue-shopping-btn" onClick={() => navigate('/menu')}>
              Continue Shopping
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
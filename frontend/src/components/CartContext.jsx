import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCart, updateUserCart } from '../services/api';

const CartContext = createContext(); 

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!(token && user));
    };

    checkAuthStatus();

    // Listen for auth changes
    window.addEventListener('loginStateChanged', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('loginStateChanged', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Load cart based on auth status
  useEffect(() => {
    if (isLoggedIn) {
      loadUserCart();
    } else {
      loadLocalCart();
    }
  }, [isLoggedIn]);

  // ✅ Load cart from server for logged-in users
  const loadUserCart = async () => {
    setLoading(true);
    try {
      const response = await getUserCart();
      setCartItems(response.data.cart || []);
      console.log('✅ User cart loaded from server:', response.data.cart?.length || 0, 'items');
    } catch (error) {
      console.error('❌ Error loading user cart:', error);
      // Fallback to local cart if server fails
      loadLocalCart();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load cart from localStorage for non-logged-in users
  const loadLocalCart = () => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('✅ Guest cart loaded from localStorage:', parsedCart.length, 'items');
      } catch (error) {
        console.error('❌ Error loading local cart:', error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  // ✅ Save cart based on auth status
  const saveCart = async (newCartItems) => {
    if (isLoggedIn) {
      try {
        await updateUserCart(newCartItems);
        console.log('✅ Cart saved to server');
      } catch (error) {
        console.error('❌ Error saving cart to server:', error);
        // Fallback to localStorage
        localStorage.setItem('guestCart', JSON.stringify(newCartItems));
      }
    } else {
      // Save to localStorage for guests
      localStorage.setItem('guestCart', JSON.stringify(newCartItems));
      console.log('✅ Guest cart saved to localStorage');
    }
  };

  // Add item to cart
  const addToCart = async (item) => {
    const newCartItems = [...cartItems];
    const existingItemIndex = newCartItems.findIndex(i => i.foodID === item.foodID);
    
    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: newCartItems[existingItemIndex].quantity + 1
      };
    } else {
      // New item, add to cart
      newCartItems.push({
        id: item._id || item.id,
        foodID: item.foodID,
        name: item.itemName,
        price: item.itemPrice,
        image: item.itemImage,
        description: item.itemDescription,
        category: item.itemCategory,
        quantity: 1
      });
    }
    
    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  // Update quantity
  const updateQuantity = async (foodID, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(foodID);
      return;
    }
    
    const newCartItems = cartItems.map(item =>
      item.foodID === foodID
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  // Remove item from cart
  const removeFromCart = async (foodID) => {
    const newCartItems = cartItems.filter(item => item.foodID !== foodID);
    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([]);
    await saveCart([]);
  };

  // ✅ Merge guest cart with user cart on login
  const mergeGuestCartOnLogin = async () => {
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart && isLoggedIn) {
      try {
        const parsedGuestCart = JSON.parse(guestCart);
        if (parsedGuestCart.length > 0) {
          // Get current user cart
          const response = await getUserCart();
          const userCart = response.data.cart || [];
          
          // Merge carts (combine quantities for same items)
          const mergedCart = [...userCart];
          
          parsedGuestCart.forEach(guestItem => {
            const existingIndex = mergedCart.findIndex(item => item.foodID === guestItem.foodID);
            if (existingIndex > -1) {
              mergedCart[existingIndex].quantity += guestItem.quantity;
            } else {
              mergedCart.push(guestItem);
            }
          });
          
          setCartItems(mergedCart);
          await saveCart(mergedCart);
          
          // Clear guest cart
          localStorage.removeItem('guestCart');
          
          console.log('✅ Guest cart merged with user cart');
        }
      } catch (error) {
        console.error('❌ Error merging guest cart:', error);
      }
    }
  };

  // Get cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const serviceFee = subtotal >= 50000 ? 0 : Math.round(subtotal * 0.05);
    
    let discount = 0;
    if (subtotal >= 50000) {
      discount = Math.round(subtotal * 0.1);
    } else if (subtotal >= 25000) {
      discount = Math.round(subtotal * 0.05);
    }
    else if (subtotal >= 10000) {
      discount = Math.round(subtotal * 0.02);
    }
    
    const total = subtotal + serviceFee - discount;
    
    return {
      subtotal,
      serviceFee,
      discount,
      total,
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    };
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    loading,
    isLoggedIn,
    mergeGuestCartOnLogin
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Export CartContext if needed elsewhere
export { CartContext };
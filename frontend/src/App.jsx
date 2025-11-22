import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';

// Import components
import Home from './pages/home/Home';
import ContactUs from './pages/contact-us/ContactUs';
import AboutUs from './pages/about us/AboutUs';
import Menu from './pages/menu/Menu';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Cart from './pages/cart/Cart';
import Admin from './pages/admin-dashboard/Admin';
import AdminSettings from './pages/admin-setting/AdminSettings';
import Checkout from './pages/checkout/Checkout';
import PaymentSuccess from './pages/payments/PaymentSuccess'; // ✅ Add this

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/about-us' element={<AboutUs/>} />
          <Route path='/menu' element={<Menu/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/admin-dashboard' element={<Admin/>} />
          <Route path='/admin-settings' element={<AdminSettings/>} />
          <Route path='/checkout' element={<Checkout/>} />
          <Route path='/payment-success' element={<PaymentSuccess/>} /> {/* ✅ Add this */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
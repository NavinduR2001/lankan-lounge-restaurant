import React from 'react'
import Home from './pages/home/home'
import ContactUs from './pages/contact-us/ContactUs'
import AboutUs from './pages/about us/AboutUs'
import Menu from './pages/menu/Menu'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Cart from './pages/cart/Cart'
import Admin from './pages/admin-dashboard/Admin'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home/>}></Route>
      <Route path='/contact-us' element={<ContactUs/>}></Route>
      <Route path='/about-us' element={<AboutUs/>}></Route>
      <Route path='/menu' element={<Menu/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/cart' element={<Cart/>}></Route>
      <Route path='/admin-dashboard/*' element={<Admin/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
import React from 'react'
import Home from './pages/home/home'
import ContactUs from './pages/contact-us/ContactUs'
import AboutUs from './pages/about us/AboutUs'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home/>}></Route>
      <Route path='/contact-us' element={<ContactUs/>}></Route>
      <Route path='/about-us' element={<AboutUs/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
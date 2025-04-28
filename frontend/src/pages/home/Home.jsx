import React from 'react'
import './Home.css';
import Header from '../../components/header/Header'
import Navbar from '../../components/Navbar/Navbar'


function Home() {
  return (
    <div className='home'>
      <Navbar/>
      <Header/>
      </div>
  )
}

export default Home
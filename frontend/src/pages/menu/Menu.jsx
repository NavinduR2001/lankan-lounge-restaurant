import './Menu.css'
import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import { biriyani, burger, one, pizza } from '../../assets/assets'


function Menu() {
  return (
    <>
    <Navbar/>
    <div className='menu-page'>
        
        <h1 className='menu-page-title'>MENU CARD</h1>
        <h3 className='menu-page-subtitle'>Explore our delicious menu</h3>

        <div className="menu-grid">
            <div className="menu-item">
                <img className='menu-top-item-image' src={one} alt="Item 1" />
                <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={biriyani} alt="Item 1" />
                <h3 className='menu-top-item-title'>Indian Food</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={one} alt="Item 1" />
                <h3 className='menu-top-item-title'>Chinese Food</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={one} alt="Item 1" />
                <h3 className='menu-top-item-title'>Family Meals</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={one} alt="Item 1" />
                <h3 className='menu-top-item-title'>Desserts</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={one} alt="Item 1" />
                <h3 className='menu-top-item-title'>Bakery Items</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={pizza} alt="Item 1" />
                <h3 className='menu-top-item-title'>Pizza</h3>
            </div>

            <div className="menu-item">
                <img className='menu-top-item-image' src={burger} alt="Item 1" />
                <h3 className='menu-top-item-title'>Burgers</h3>
            </div>
            
        </div>

        <div className="menu-container">
            <div className="sub-menu">

            
                
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Sri Lankan Food</h2>
                    <div className="line line-menu"></div>
                 </div>

                <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>

              <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>

                <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>

                 <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>

                 <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 

            </div>
            </div>

            <div className="sub-menu">
               <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Indian Food</h2>
                    <div className="line line-menu"></div>
                 </div>

                <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>
                
            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Chinese Food</h2>
                    <div className="line line-menu"></div>
                 </div>

                <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Family Meals</h2>
                    <div className="line line-menu"></div>
                 </div>

                  <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Desserts</h2>
                    <div className="line line-menu"></div>
                 </div>

                  <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Bakery Items</h2>
                    <div className="line line-menu"></div>
                 </div>

                  <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Pizza</h2>
                    <div className="line line-menu"></div>
                 </div>

                  <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>

            <div className="sub-menu">
                <div className="line-about-menu">
                    <div className="line line-menu"></div>
                        <h2 className='sub-menu-title'>Burgers</h2>
                    <div className="line line-menu"></div>
                 </div>

                  <div className="sub-menu-container">
                    <div className="menu-item">
                        <img className='menu-top-item-image' src={one} alt="Item 1" />
                        <h3 className='menu-top-item-title'>Sri Lankan Food</h3>
                        <h3 className='price'>Rs. 500.00</h3>
                        <p className='item-porsion'>1 Person</p>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                 </div>
                 </div>

            </div>
        </div>

    </div>
    </>
  )
}

export default Menu
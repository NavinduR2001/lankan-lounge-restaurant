import React from 'react'
import './Home.css';
import Header from '../../components/header/Header'
import Navbar from '../../components/Navbar/Navbar'
import { chicken, lplate, rplate,rostedChicken,pizza } from '../../assets/assets';


function Home() {
  return (
    <div className='home'>
      <div className="top">
      <Navbar/>
      <Header/>
      </div>

      <div className="welcome">

        <h1 className='welcome-title'>Welcome to the Lankan Lounge</h1>
        <div className="line-resturent">
         <div className="line resline"></div><h2>Restaurant</h2><div className="line resline">
         </div>
       </div>
       <div className="welcome-img">
        <img src={rplate} alt="welcome-img" className=' plateimg left-plate' />
        <img src={chicken} alt="welcome-img" className=' chicken' />
        <img src={lplate} alt="welcome-img" className=' plateimg right-plate' />
       </div>
        <h2 className='ordercap'> Order | Take Away | Enjoy </h2>
      </div>

      {/* <div className="offers">
        <h1 className='offer-title'>SPECIAL OFFERS</h1>
        <div className="offer-container">
          <div className="offer-card">
            </div>
            <div className="offer-card">
            </div>
            <div className="offer-card">
            </div>
            <div className="offer-card">
            </div>
          </div>
      </div> */}
      <h1 className='dishes-title'>OUR TRENDING DISHES</h1>
     <div className="line-resturent">
         <div className="line resline dishline"></div><h2 className='dishes-subtitle'>in this week</h2><div className="line resline dishline">
         </div>
        </div>
      <div className="dishes">

        <div className="dish-card">
          <div className='dish-image-placeholder'><img src={pizza} alt="Pizza" className='rostedchicken-image' /></div>

          <div className='dish-name'>
            <h1 className="dish-title">Tomato Cheese Pizza </h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <h3 className='dish-rating'>Rating: ★★★★☆</h3>
            <p className='sdish-description'>The Pizza is a delicious blend of flavors, topped with fresh ingredients and melted cheese. Specially tomato pieces are used to enhance the taste. This specialty is a must-try for pizza lovers!</p>
            <p className='person'>2 Persons(M)</p>
            <p className='price'>LKR. 2400.00</p>
            <div className='add-to-cart-button'>
            <button className='add-to-cart-btn'>Add to Cart</button>
          </div>
          </div>
        </div>

        <div className="dish-card">
         

          <div className='dish-name'>
            <h1 className="dish-title" >Spicy Rosted Chicken</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <h3 className='dish-rating'>Rating: ★★★★☆</h3>
            <p className='sdish-description'>The perfect blend of spices and flavors. This dish is a must-try for spice lovers!. Chicken is marinated with a special blend of spices and roasted to perfection.</p>
            <p className='person'>2 Persons</p>
            <p className='price'>LKR. 5400.00</p>
            <div className='add-to-cart-button'>
            <button className='add-to-cart-btn'>Add to Cart</button>
          </div>
          </div>

           <div className='dish-image-placeholder'><img src={rostedChicken} alt="Rosted Chicken" className='rostedchicken-image' /></div>
        </div>

        <div className="dish-card">
          <div className='dish-image-placeholder'><img src={rostedChicken} alt="Rosted Chicken" className='rostedchicken-image' /></div>

          <div className='dish-name'>
            <h1 className="dish-title" >Spicy Rosted Chicken</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <h3 className='dish-rating'>Rating: ★★★★☆</h3>
            <p className='sdish-description'>The perfect blend of spices and flavors. This dish is a must-try for spice lovers!. Chicken is marinated with a special blend of spices and roasted to perfection.</p>
            <p className='person'>2 Persons</p>
            <p className='price'>LKR. 5400.00</p>
            <div className='add-to-cart-button'>
            <button className='add-to-cart-btn'>Add to Cart</button>
          </div>
          </div>
        </div>

        <div className="dish-card">
         
          <div className='dish-name'>
            <h1 className="dish-title" >Spicy Rosted Chicken</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <h3 className='dish-rating'>Rating: ★★★★☆</h3>
            <p className='sdish-description'>The perfect blend of spices and flavors. This dish is a must-try for spice lovers!. Chicken is marinated with a special blend of spices and roasted to perfection.</p>
            <p className='person'>2 Persons</p>
            <p className='price'>LKR. 5400.00</p>
            <div className='add-to-cart-button'>
            <button className='add-to-cart-btn'>Add to Cart</button>
          </div>
          </div>
           <div className='dish-image-placeholder'><img src={rostedChicken} alt="Rosted Chicken" className='rostedchicken-image' /></div>

        </div>

        


      </div>

    </div>
  )
}

export default Home
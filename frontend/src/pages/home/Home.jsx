import React, { useEffect } from 'react'
import './Home.css';
import Header from '../../components/header/Header'
import Navbar from '../../components/navbar/Navbar'
import { chicken, lplate, rplate, rostedChicken, pizza, burger, biriyani } from '../../assets/assets';
import { IoFastFoodSharp } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { SiCodechef } from "react-icons/si";
import Footer from '../../components/footer/Footer';

function Home() {
  useEffect(() => {
    // Intersection Observer for repeating scroll animations
    const observerOptions = {
      threshold: 0.4, // Trigger when 30% of element is visible
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animate class when element enters viewport
          entry.target.classList.add('animate');
        } else {
          // Remove animate class when element leaves viewport
          entry.target.classList.remove('animate');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // Cleanup observer on component unmount
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className='home'>
      <div className="top">
        <Navbar/>
        <Header/>
      </div>

      <div className="welcome">
        <h1 className='welcome-title scroll-animate fade-in'>Welcome to the Lankan Lounge</h1>
        <div className="line-resturent">
          <h2 className='scroll-animate fade-in delay-1'>Restaurant</h2>
        </div>
        <div className="welcome-img scroll-animate">
          <img src={rplate} alt="welcome-img" className='plateimg left-plate plate-img-ani' />
          <img src={chicken} alt="welcome-img" className='chicken' />
          <img src={lplate} alt="welcome-img" className='plateimg right-plate plate-img-ani' />
        </div>
        <h2 className='ordercap scroll-animate fade-up delay-3'>Order | Take Away | Enjoy</h2>
      </div>

      <h1 className='dishes-title scroll-animate fade-in'>OUR TRENDING DISHES</h1>
      <div className="line-resturent">
        <div className="line resline dishline"></div>
        <h2 className='dishes-subtitle scroll-animate fade-in delay-1'>in this week</h2>
        <div className="line resline dishline"></div>
      </div>

      <div className="dishes">
        <div className="dish-card scroll-animate pop-up">
          <div className='dish-image-placeholder'>
            <img src={pizza} alt="Pizza" className='rostedchicken-image' />
          </div>
          <div className='dish-name'>
            <h1 className="dish-title">Tomato Cheese Pizza</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <p className='sdish-description'>The Pizza is a delicious blend of flavors, topped with fresh ingredients and melted cheese. Specially tomato pieces are used to enhance the taste. This specialty is a must-try for pizza lovers!</p>
            <p className='person'>2 Persons(M)</p>
            <p className='price'>LKR. 2400.00</p>
            <div className='add-to-cart-button'>
              <button className='add-to-cart-btn'>Add to Cart</button>
            </div>
          </div>
        </div>

        <div className="dish-card scroll-animate pop-up delay-1">
          <div className='dish-name'>
            <h1 className="dish-title">Spicy Rosted Chicken</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <p className='sdish-description'>The perfect blend of spices and flavors. This dish is a must-try for spice lovers!. Chicken is marinated with a special blend of spices and roasted to perfection.</p>
            <p className='person'>2 Persons</p>
            <p className='price'>LKR. 5400.00</p>
            <div className='add-to-cart-button'>
              <button className='add-to-cart-btn'>Add to Cart</button>
            </div>
          </div>
          <div className='dish-image-placeholder'>
            <img src={rostedChicken} alt="Rosted Chicken" className='rostedchicken-image' />
          </div>
        </div>

        <div className="dish-card scroll-animate pop-up delay-2">
          <div className='dish-image-placeholder'>
            <img src={burger} alt="Burger" className='rostedchicken-image' />
          </div>
          <div className='dish-name'>
            <h1 className="dish-title">Classic Cheeseburger</h1>
            <h2>Burger</h2>
            <div className="dline"></div>
            <p className='sdish-description'>Cheeseburgers are an all-time favorite classic. They're a hug between two slices of bread with the perfect combination of melted cheese, bacon, and vibrant vegetables—fresh lettuce, tomato, onion, avocado, and mushrooms. Pickles, mayonnaise, ketchup, and mustard enhance the overall taste.</p>
            <p className='person'>1 Person</p>
            <p className='price'>LKR. 900.00</p>
            <div className='add-to-cart-button'>
              <button className='add-to-cart-btn'>Add to Cart</button>
            </div>
          </div>
        </div>

        <div className="dish-card scroll-animate pop-up delay-3">
          <div className='dish-name'>
            <h1 className="dish-title">Chicken Biriyani</h1>
            <h2>Sri Lankan</h2>
            <div className="dline"></div>
            <p className='sdish-description'>The perfect blend of spices and flavors. This dish is a must-try for spice lovers!. Chicken is marinated with a special blend of spices and roasted to perfection.</p>
            <p className='person'>2 Persons</p>
            <p className='price'>LKR. 5400.00</p>
            <div className='add-to-cart-button'>
              <button className='add-to-cart-btn'>Add to Cart</button>
            </div>
          </div>
          <div className='dish-image-placeholder'>
            <img src={biriyani} alt="Biriyani" className='rostedchicken-image' />
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section">
          <div className="line-about">
            <div className="line aboutline"></div>
            <h2 className='services-subtitle scroll-animate fade-in'>Why Choose Us</h2>
            <div className="line aboutline"></div>
          </div>
          
          <div className="services-grid">
            <div className="service-card-home scroll-animate bounce-in">
              <div className="service-icon"><IoFastFoodSharp /></div>
              <div className="service-number">100+</div>
              <h3>Weekly Orders</h3>
              <p>We proudly serve over 100 orders every week, delivering fresh and delicious meals to our valued customers.</p>
            </div>

            <div className="service-card-home scroll-animate bounce-in delay-1">
              <div className="service-icon"><TbTargetArrow /></div>
              <div className="service-number">★★★★★</div>
              <h3>Best Customer Service</h3>
              <p>Our dedicated team ensures every customer receives exceptional service with a smile. Your satisfaction is our priority.</p>
            </div>

            <div className="service-card-home scroll-animate bounce-in delay-2">
              <div className="service-icon"><SiCodechef /></div>
              <div className="service-number">A+</div>
              <h3>High Quality Food</h3>
              <p>We use only the finest ingredients and traditional cooking methods to ensure every dish meets the highest quality standards.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
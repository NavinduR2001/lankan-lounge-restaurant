import React from 'react'
import './AboutUs.css'
import Navbar from '../../components/navbar/Navbar'
import { 
   one, two, three, four, five,
   six,
   seven,
   eight,
   nine,
   ten
} from '../../assets/assets'
import { GiTrophy } from "react-icons/gi";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FaMedal } from "react-icons/fa";

import { IoFastFoodSharp } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { SiCodechef } from "react-icons/si";
import Footer from '../../components/footer/Footer';

function AboutUs() {
  return (
    <div className='about-us'>
      <Navbar />
      
      {/* Hero Section
      <div className="about-hero">
        <div className="about-header">
          <img src={logo} className='about-logo' alt="Lankan Lounge Logo" />
          <h1 className='about-title'>About Lankan Lounge</h1>
          <div className="line-about">
            <div className="line aboutline"></div>
            <h2 className='about-subtitle'>Our Story</h2>
            <div className="line aboutline"></div>
          </div>
        </div>
      </div> */}

      {/* Discover Our Story Section */}
      <div className="story-section">
        <div className="story-content">
          <div className="story-text">
            <h1 className="story-title">Discover Our Story</h1>
            <h2 className="story-subtitle">From Humble Beginnings to Culinary Excellence</h2>
            <p className="story-description">
              Welcome to Lankan Lounge, where authentic Sri Lankan flavors meet modern culinary excellence. 
              Established in 2015, we have been serving the finest traditional dishes with a contemporary twist 
              for over 8 years. Our journey began with a simple vision: to bring the rich, vibrant tastes of 
              Sri Lankan cuisine to food lovers around the world.
            </p>
            <p className="story-description">
              From our humble beginnings as a small family restaurant, we have grown into a beloved culinary 
              destination with multiple locations. Each dish is crafted with love, using traditional recipes 
              passed down through generations, combined with the freshest local ingredients.
            </p>
            <p className="story-description">
              Our commitment to quality, authenticity, and exceptional service has made us the go-to place 
              for those seeking an unforgettable dining experience. Come taste the difference that passion 
              and tradition make.
            </p>
          </div>
          <div className="story-image">
            <img src={nine} alt="Our Story" 
            className="story-img" />
            <img src={eight} alt="Our Story" className="story-img-sub" />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <h1 className="gallery-title">Our Gallery</h1>
        <div className="line-about">
          <div className="line aboutline"></div>
          <h2 className='gallery-subtitle'>Delicious Moments</h2>
          <div className="line aboutline"></div>
        </div>
        
        <div className="gallery-grid">
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={one} ></img></div>
            <div className="gallery-overlay">
              <h3>Signature Pizza</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={two} ></img></div>
            <div className="gallery-overlay">
              <h3>Classic Burger</h3>
            </div>
          </div>
          <div className="gallery-item large">
            <div className="gallery-placeholder"><img src={three} ></img></div>
            <div className="gallery-overlay">
              <h3>Spicy Biriyani</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={four} ></img></div>
            <div className="gallery-overlay">
              <h3>Roasted Chicken</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={five} ></img></div>
            <div className="gallery-overlay">
              <h3>Traditional Platter</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={six} ></img></div>
            <div className="gallery-overlay">
              <h3>Lunch Special</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={seven} ></img></div>
            <div className="gallery-overlay">
              <h3>Grilled Chicken</h3>
            </div>
          </div>
          <div className="gallery-item large">
            <div className="gallery-placeholder"><img src={eight} alt="Gallery Item 8" /></div>
            <div className="gallery-overlay">
              <h3>Wood Fire Pizza</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={nine} ></img></div>
            <div className="gallery-overlay">
              <h3>Gourmet Burger</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={ten} ></img></div>
            <div className="gallery-overlay">
              <h3>Seafood Biriyani</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Section
      <div className="branches-section">
        <h1 className="branches-title">Our Outlets</h1>
        <div className="line-about">
          <div className="line aboutline"></div>
          <h2 className='branches-subtitle'>Locations</h2>
          <div className="line aboutline"></div>
        </div>
        
        <div className="branches-grid">
          <div className="branch-card">
            <div className="branch-icon">🏢</div>
            <h3>Colombo Main Branch</h3>
            <p className="branch-address">123 Galle Road, Colombo 03</p>
            <p className="branch-phone">📞 +94 11 234 5678</p>
            <p className="branch-hours">⏰ 10:00 AM - 11:00 PM</p>
          </div>

          <div className="branch-card">
            <div className="branch-icon">🌊</div>
            <h3>Negombo Beach Branch</h3>
            <p className="branch-address">45 Beach Road, Negombo</p>
            <p className="branch-phone">📞 +94 31 567 8901</p>
            <p className="branch-hours">⏰ 9:00 AM - 12:00 AM</p>
          </div>

          <div className="branch-card">
            <div className="branch-icon">🏛️</div>
            <h3>Kandy Heritage Branch</h3>
            <p className="branch-address">78 Peradeniya Road, Kandy</p>
            <p className="branch-phone">📞 +94 81 234 5678</p>
            <p className="branch-hours">⏰ 11:00 AM - 10:00 PM</p>
          </div>

          <div className="branch-card">
            <div className="branch-icon">🛍️</div>
            <h3>Galle Fort Branch</h3>
            <p className="branch-address">12 Church Street, Galle Fort</p>
            <p className="branch-phone">📞 +94 91 345 6789</p>
            <p className="branch-hours">⏰ 10:30 AM - 11:30 PM</p>
          </div>

          <div className="branch-card">
            <div className="branch-icon">🌄</div>
            <h3>Nuwara Eliya Branch</h3>
            <p className="branch-address">25 Queen Elizabeth Drive, Nuwara Eliya</p>
            <p className="branch-phone">📞 +94 52 678 9012</p>
            <p className="branch-hours">⏰ 8:00 AM - 9:00 PM</p>
          </div>
        </div>
      </div> */}

      {/* Services Section
      <div className="services-section">
        <h1 className="services-title">Our Services</h1>
        <div className="line-about">
          <div className="line aboutline"></div>
          <h2 className='services-subtitle'>Why Choose Us</h2>
          <div className="line aboutline"></div>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon"><IoFastFoodSharp /></div>
            <div className="service-number">100+</div>
            <h3>Weekly Orders</h3>
            <p>We proudly serve over 100 orders every week, delivering fresh and delicious meals to our valued customers.</p>
          </div>

          <div className="service-card">
            <div className="service-icon"><TbTargetArrow /></div>
            <div className="service-number">★★★★★</div>
            <h3>Best Customer Service</h3>
            <p>Our dedicated team ensures every customer receives exceptional service with a smile. Your satisfaction is our priority.</p>
          </div>

          <div className="service-card">
            <div className="service-icon"><SiCodechef /></div>
            <div className="service-number">A+</div>
            <h3>High Quality Food</h3>
            <p>We use only the finest ingredients and traditional cooking methods to ensure every dish meets the highest quality standards.</p>
          </div>
        </div>
      </div> */}

      {/* Achievements Section */}
      <div className="achievements-section">
        <h1 className="achievements-title">Our Achievements</h1>
        <div className="line-about">
          <div className="line aboutline"></div>
          <h2 className='achievements-subtitle'>Awards & Recognition</h2>
          <div className="line aboutline"></div>
        </div>
        
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon"><GiTrophy /></div>
            <h3>Best Sri Lankan Restaurant 2023</h3>
            <p className="achievement-issuer">Sri Lankan Culinary Association</p>
            <p className="achievement-description">
              Recognized for excellence in traditional Sri Lankan cuisine and outstanding service quality.
            </p>
            <div className="achievement-date">Awarded: December 2023</div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon"><AiFillSafetyCertificate /></div>
            <h3>Excellence in Food Safety Certificate</h3>
            <p className="achievement-issuer">Ministry of Health - Sri Lanka</p>
            <p className="achievement-description">
              Certified for maintaining the highest standards of food safety and hygiene across all our branches.
            </p>
            <div className="achievement-date">Certified: January 2024</div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon"><FaMedal /></div>
            <h3>Premium Dining Experience Award</h3>
            <p className="achievement-issuer">Tourism Development Authority</p>
            <p className="achievement-description">
              Honored for providing exceptional dining experiences that showcase Sri Lankan hospitality to international visitors.
            </p>
            <div className="achievement-date">Awarded: March 2024</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
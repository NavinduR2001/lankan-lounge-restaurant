import React, { useEffect, useRef } from 'react'
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
  const storyRef = useRef(null);
  const galleryRef = useRef(null);
  const achievementsRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2, // Trigger when 20% of element is visible
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animate class when element enters viewport
          entry.target.classList.add('animate-in');
        } else {
          // Remove animate class when element leaves viewport (for repeating)
          entry.target.classList.remove('animate-in');
        }
      });
    }, observerOptions);

    // Observe sections
    if (storyRef.current) observer.observe(storyRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);
    if (achievementsRef.current) observer.observe(achievementsRef.current);

    // Observe gallery items and achievement cards individually
    const galleryItems = document.querySelectorAll('.gallery-item');
    const achievementCards = document.querySelectorAll('.achievement-card');

    galleryItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);
    });

    achievementCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
      <div className="story-section" ref={storyRef}>
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
      <div className="gallery-section" ref={galleryRef}>
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
              <h3>Signature</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={two} ></img></div>
            <div className="gallery-overlay">
              <h3>Classic</h3>
            </div>
          </div>
          <div className="gallery-item large">
            <div className="gallery-placeholder"><img src={three} ></img></div>
            <div className="gallery-overlay">
              <h3>Spicy</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={four} ></img></div>
            <div className="gallery-overlay">
              <h3>Roasted</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={five} ></img></div>
            <div className="gallery-overlay">
              <h3>Traditional</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={six} ></img></div>
            <div className="gallery-overlay">
              <h3>Quality</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={seven} ></img></div>
            <div className="gallery-overlay">
              <h3>Solty</h3>
            </div>
          </div>
          <div className="gallery-item large">
            <div className="gallery-placeholder"><img src={eight} alt="Gallery Item 8" /></div>
            <div className="gallery-overlay">
              <h3>Cheesy</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={nine} ></img></div>
            <div className="gallery-overlay">
              <h3>Creamy</h3>
            </div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder"><img src={ten} ></img></div>
            <div className="gallery-overlay">
              <h3>Satisfied</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section" ref={achievementsRef}>
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
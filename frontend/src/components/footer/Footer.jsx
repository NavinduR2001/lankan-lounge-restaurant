import React from 'react';
import './Footer.css';
import { logo } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaHeart
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <img src={logo} alt="Gami Gedara Logo" />
            </div>
            <h3>Lankan Lounge Restaurant</h3>
            <p className="company-description">
              Experience authentic Sri Lankan cuisine crafted with traditional recipes 
              and the finest ingredients. We bring you the true taste of Sri Lanka 
              in every bite.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section services">
            <h3>Our Services</h3>
            <ul>
              <li>🍽️ Dine In</li>
              <li>🥡 Takeaway</li>
              <li>🚚 Online Ordering</li>
              <li>🎉 Catering Services</li>
              <li>📞 24/7 Customer Support</li>
            </ul>
          </div>

          <div className="footer-section contact-info">
            <h3>Get In Touch</h3>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-details-footer">
                No 123, Galle Road, Colombo
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div className="contact-details-footer">
                +94 11 234 5678
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-details-footer">
                info@lankanloungemain.com
              </div>
            </div>
          </div>
          
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for latest offers and updates!</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2024 Lankan Lounge Restaurant. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-conditions">Terms & Conditions</Link>
              <Link to="/refund-policy">Refund Policy</Link>
            </div>
            <div className="made-with-love">
              <p>Made with <FaHeart className="heart-icon" /> for food lovers</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
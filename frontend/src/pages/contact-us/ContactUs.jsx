import React from 'react'
import './ContactUs.css'
import Navbar from '../../components/navbar/Navbar'
import { logo } from '../../assets/assets'
import { branch } from '../../assets/assets'
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

function ContactUs() {
  return (
    <>
      <Navbar/>
      <div className="contact-us-container">
        <div className="header">
          <div className="header-img">
            <img src={logo} className='logo' />
            <h1>CONTACT US</h1>
          </div>
        </div>
        
        {/* <div className="branch-container">
          <div className="branch">
            <div className="branch-border">
              <img src={branch} className='branch-img'/>
              <div className="branch-content">
                <h2>COLOMBO</h2>
                <p><FaLocationDot /> No 123, Galle Road, Colombo</p>
                <p><FaPhone />  +94 11 234 5678</p>
                <p><MdEmail /> info@gamigedara.com</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="container">
        <div className="contact-form">
            <div className="cform">
                <h2>SEND US A MESSAGE</h2>
                <div className="line"></div>
                <h3>We would love to hear from you!</h3>
                <form className='form-fields'>
                    <input type="text" className='input' placeholder="Your Name" required />
                    <input type="email" className='input' placeholder="Your Email" required />
                    <input type="text" className='input' placeholder="Subject" required />
                    <textarea className='input-messsage' placeholder="Message" required></textarea>
                    <button className='button-c' type="submit">Send Message</button>
                </form>
            </div>
            <div className="form-image"></div>
        </div>
        </div>

        <div className="map">
          <div className="map-frame">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d962.0005511138716!2d79.85776922391781!3d6.9195977313594135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1758887178370!5m2!1sen!2slk" 
              width="700" 
              height="350" 
              style={{border: 0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          <div className="contact-details">
            <h2>CONTACT WITH US !</h2>
            <p><FaLocationDot /> No 123, Galle Road, Colombo, Sri Lanka</p>
            <p><FaPhone />  +94 11 234 5678</p>
            <p><MdEmail /> info@gamigedara.com</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUs
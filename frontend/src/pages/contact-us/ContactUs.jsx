import React from 'react'
import './ContactUs.css'
import Navbar from '../../components/navbar/Navbar'
import { logo } from '../../assets/assets'
import { branch } from '../../assets/assets'
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Footer from '../../components/footer/Footer'

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
        
        <div className="branch-container">

          <div className="branch">
            <div className="branch-border">
              {/* <img src={branch} className='branch-img'/> */}
              <div className="branch-content">
                <h2>MATARA</h2>
                <p><FaLocationDot /> No 23/1, Tangalle Road, Matara</p>
                <p><FaPhone />  +94 47 113 4549</p>
                <p><MdEmail /> matara@gamigedara.com</p>
              </div>
            </div>
          </div>

           <div className="branch">
            <div className="branch-border">
              {/* <img src={branch} className='branch-img'/> */}
              <div className="branch-content">
                <h2>GALLE</h2>
                <p><FaLocationDot /> Near the Galle fort, Galle</p>
                <p><FaPhone />  +94 47 113 4545</p>
                <p><MdEmail /> galle@gamigedara.com</p>
              </div>
            </div>
          </div>

           <div className="branch">
            <div className="branch-border">
              {/* <img src={branch} className='branch-img'/> */}
              <div className="branch-content">
                <h2>COLOMBO</h2>
                <p><FaLocationDot /> No 234/2, Galkissa Road, Colombo 7</p>
                <p><FaPhone />  +94 47 113 4546</p>
                <p><MdEmail /> colombo@gamigedara.com</p>
              </div>
            </div>
          </div>

           <div className="branch">
            <div className="branch-border">
              {/* <img src={branch} className='branch-img'/> */}
              <div className="branch-content">
                <h2>KALUTARA</h2>
                <p><FaLocationDot /> No 90/1, Nagoda, Kalutara</p>
                <p><FaPhone />  +94 47 113 4547</p>
                <p><MdEmail /> kalutara@gamigedara.com</p>
              </div>
            </div>
          </div>

           <div className="branch">
            <div className="branch-border">
              {/* <img src={branch} className='branch-img'/> */}
              <div className="branch-content">
                <h2>KANDY</h2>
                <p><FaLocationDot /> No 60/1, Colombo Road, Kandy</p>
                <p><FaPhone />  +94 47 113 4548</p>
                <p><MdEmail /> kandy@gamigedara.com</p>
              </div>
            </div>
          </div>

        </div>
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
            <div className="form-image">
            

            </div>
        </div>
        </div>

     
        
        <Footer />
      </div>
    </>
  )
}

export default ContactUs
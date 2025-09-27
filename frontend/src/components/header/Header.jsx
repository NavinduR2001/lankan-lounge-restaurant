import React, { useEffect, useState } from 'react';
import './Header.css'
import background_video from "../../assets/background-video.mp4";
import {logo} from '../../assets/assets'

const messages = [
  "TRADITIONAL FLAVOURS!",
  "HEALTHY!",
  "SIGNATURE DISHES!",
  "24-HOUR SERVICE!",
  "ONLINE ORDER!",
  "TAKE AWAY!",
  "FAST DELIVERY!"
];

function Header() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFade(false), 2000); // After 2s, start fade out
    const nextMessageTimer = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setFade(true);
    }, 2500); // Change message after fade out

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextMessageTimer);
    };
  }, [index]);

    
  return (
  <>
  <div className='header-container'>
        <div className="video-bg">
            <div className="overlay"></div>
            <video src={background_video} autoPlay loop muted></video>
        </div>

      <div className="animated_text">
        <div className={`fade-text ${fade ? 'fade-in' : 'fade-out'}`}>
        {messages[index]}</div>
      
      </div> 

        <div className="content">
            <div className="logo-img"><img src={logo}></img></div>
            
                <h3>SRI LANKAN CULTURAL RESTAURENT</h3>
                <button className='header-order'>ORDER NOW</button>
        </div>
    </div>
    <div className="outlet">
          <div className="outlet-container">
            <div className="outlet-item item-first">
              <h3>MATARA</h3>
              <h4>+94 47 113 4549</h4>
              </div>
            <div className="outlet-item">
              <h3>GALLE</h3>
              <h4>+94 47 113 4545</h4>
              </div>
            <div className="outlet-item">
              <h3>COLOMBO</h3>
              <h4>+94 47 113 4546</h4>
              </div>
            <div className="outlet-item">
              <h3>KALUTARA</h3>
              <h4>+94 47 113 4547</h4>
              </div>
            <div className="outlet-item ">
              <h3>KANDY</h3>
              <h4>+94 47 113 4548</h4>
              </div>
          </div>
    </div>
  </>
  )
}

export default Header
import React, { useState } from 'react'
import "./Newsletter.css"

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() !== '') {
      setShowPopup(true);
      setEmail('');
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers on Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input
          type='email'
          placeholder='Your Email id'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>
      {showPopup && (
        <div className="newsletter-popup">
          Successfully subscribed!
        </div>
      )}
    </div>
  )
}

export default Newsletter
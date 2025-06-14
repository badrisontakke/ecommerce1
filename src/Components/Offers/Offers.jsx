import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Offers.css"
import exclusive from "../../assets/exclu.webp"

const Offers = () => {
  const navigate = useNavigate();

  const handleCheckNow = () => {
    navigate('/womens');
  };

  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>AMAZING</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button onClick={handleCheckNow}>Check IT Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive} alt="" />
      </div>
    </div>
  )
}

export default Offers
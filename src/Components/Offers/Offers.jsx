import React from 'react'
import "./Offers.css"
import exclusive from "../../assets/exclu.webp"
const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
           <h1>AMAZING</h1>
           <h1>Offers For You</h1>
           <p>ONLY ON BEST SELLERS PRODUCTS</p>
           <button>Check IT Now</button>
        </div>
        <div className="offers-right">
<img src={exclusive} alt="" />
        </div>
    </div>
  )
}

export default Offers
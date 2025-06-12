import React, { useContext, useState, useEffect, useRef } from 'react'
import "./CartItems.css"
import remove_icon from "../../assets/remove.webp"
import { ShopContext } from '../../Context/ShopContext'

const PAYPAL_CLIENT_ID = "test"; // Replace with your real PayPal client ID

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart } = useContext(ShopContext);
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const paypalRef = useRef();

    // Dynamically load PayPal SDK
    useEffect(() => {
        if (paymentMethod === 'paypal' && showCardForm && !window.paypal) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
            script.async = true;
            script.onload = () => renderPayPalButton();
            document.body.appendChild(script);
        } else if (paymentMethod === 'paypal' && showCardForm && window.paypal) {
            renderPayPalButton();
        }
        // eslint-disable-next-line
    }, [paymentMethod, showCardForm]);

    const renderPayPalButton = () => {
        if (window.paypal && paypalRef.current) {
            paypalRef.current.innerHTML = ""; // Clear previous button if any
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: getTotalCartAmount().toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(function(details) {
                        localStorage.setItem('order', JSON.stringify({ paypal: details, cart: cartItems }));
                        setShowCardForm(false);
                        setOrderPlaced(true);
                        clearCart && clearCart();
                        setTimeout(() => setOrderPlaced(false), 2500);
                    });
                }
            }).render(paypalRef.current);
        }
    };

    const handleProceed = () => {
        setShowCardForm(true);
    };

    const handleCardChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handleCardSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('order', JSON.stringify({ ...cardDetails, cart: cartItems }));
        setShowCardForm(false);
        setOrderPlaced(true);
        setCardDetails({ name: '', number: '', expiry: '', cvv: '' }); // clear card fields
        clearCart && clearCart(); // clear cart
        setTimeout(() => setOrderPlaced(false), 2500);
    };

    return (
        <div className='cartItems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div key={e.id}>
                        <div className='cartItems-format cartitems-format-main'>
                            <img src={e.image} alt="" height="120px" style={{ width: "120px", objectFit: "cover" }} />
                            <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>{e.name}</p>
                            <p style={{ fontSize: "1.1rem" }}>${e.new_price}</p>
                            <button className='cartitems-quantity' style={{ fontSize: "1.1rem", minWidth: "40px" }}>
                                {cartItems[e.id]}
                            </button>
                            <p style={{ fontSize: "1.1rem" }}>${e.new_price * cartItems[e.id]}</p>
                            <img src={remove_icon} alt="" onClick={() => removeFromCart(e.id)} height="28px" style={{ cursor: "pointer" }} />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1 style={{ fontSize: "2rem" }}>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p style={{ fontSize: "1.1rem" }}>Subtotal</p>
                            <p style={{ fontSize: "1.1rem" }}>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p style={{ fontSize: "1.1rem" }}>Shipping Fee</p>
                            <p style={{ fontSize: "1.1rem", color: "#28a745", fontWeight: "bold" }}>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Total</p>
                            <p style={{ fontSize: "1.2rem", color: "#e52e71", fontWeight: "bold" }}>${getTotalCartAmount()}</p>
                        </div>
                    </div>
                    <button onClick={handleProceed} style={{
                        background: "linear-gradient(90deg, #ff8a00, #e52e71)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "14px 36px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "18px"
                    }}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type='text' placeholder='promo code' style={{ fontSize: "1rem", padding: "8px" }} />
                        <button style={{
                            background: "#e52e71",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 18px",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}>submit</button>
                    </div>
                </div>
            </div>
            {showCardForm && (
                <div className="card-form-popup">
                    <div style={{ marginBottom: "18px", textAlign: "center" }}>
                        <label style={{ marginRight: "18px", fontWeight: "bold" }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                style={{ marginRight: "6px" }}
                            />
                            Pay with Card
                        </label>
                        <label style={{ fontWeight: "bold" }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                                style={{ marginRight: "6px" }}
                            />
                            Pay with PayPal
                        </label>
                    </div>
                    {paymentMethod === 'card' && (
                        <form className="card-form" onSubmit={handleCardSubmit}>
                            <h2 style={{ textAlign: "center", marginBottom: "18px", color: "#e52e71", fontSize: "2rem" }}>Enter Card Details</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Cardholder Name"
                                value={cardDetails.name}
                                onChange={handleCardChange}
                                className="card-input"
                                style={{ fontSize: "1.1rem", padding: "12px" }}
                                required
                            />
                            <input
                                type="text"
                                name="number"
                                placeholder="Card Number"
                                value={cardDetails.number}
                                onChange={handleCardChange}
                                className="card-input"
                                maxLength={16}
                                style={{ fontSize: "1.1rem", padding: "12px" }}
                                required
                            />
                            <div style={{ display: "flex", gap: "14px" }}>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="Expiry (MM/YY)"
                                    value={cardDetails.expiry}
                                    onChange={handleCardChange}
                                    className="card-input"
                                    maxLength={5}
                                    style={{ fontSize: "1.1rem", padding: "12px" }}
                                    required
                                />
                                <input
                                    type="password"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={cardDetails.cvv}
                                    onChange={handleCardChange}
                                    className="card-input"
                                    maxLength={4}
                                    style={{ fontSize: "1.1rem", padding: "12px" }}
                                    required
                                />
                            </div>
                            <div style={{ display: "flex", gap: "16px", marginTop: "20px", justifyContent: "center" }}>
                                <button type="submit" className="place-order-btn" style={{
                                    background: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px 32px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}>Place Order</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowCardForm(false)} style={{
                                    background: "#e52e71",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px 32px",
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}>Cancel</button>
                            </div>
                        </form>
                    )}
                    {paymentMethod === 'paypal' && (
                        <div>
                            <div ref={paypalRef} style={{ margin: "24px 0" }} />
                            <button type="button" className="cancel-btn" onClick={() => setShowCardForm(false)} style={{
                                background: "#e52e71",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 32px",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "block",
                                margin: "0 auto"
                            }}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
            {orderPlaced && (
                <div className="order-popup" style={{
                    position: "fixed",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#fff",
                    color: "#28a745",
                    borderRadius: "16px",
                    boxShadow: "0 4px 24px #0002",
                    padding: "48px 64px",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 2000,
                    animation: "pop-in 0.3s"
                }}>
                    <span role="img" aria-label="success" style={{ fontSize: '3rem' }}>✅</span>
                    <div style={{ marginTop: "18px" }}>Order placed successfully!</div>
                </div>
            )}
        </div>
    )
}

export default CartItems
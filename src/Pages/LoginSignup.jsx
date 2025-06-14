import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/LoginSignup.css";

const LoginSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert('You must agree to the terms.');
      return;
    }
    // Here you would send data to your backend or handle signup logic
    alert('Signed up successfully!');
    // Optionally redirect to login or dashboard
    // navigate('/login');
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='loginsignup-fields'>
            <input
              type='text'
              placeholder='Your Name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='loginsignup-agree'>
            <input
              type='checkbox'
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              id='agree'
            />
            <label htmlFor='agree'>
              By continuing, I agree to the terms of use & privacy policy.
            </label>
          </div>
          <button type="submit">Continue</button>
        </form>
        <p className="loginsignup-login">
          Already have an account?{' '}
          <span
            style={{ color: '#007bff', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
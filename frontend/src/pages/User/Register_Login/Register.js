import React, { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../static/css/Register.css'; // Make sure to create this CSS file for styling
import { BaseUrl } from '../../../utils/config';
import axios from 'axios';

const Register = () => {
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registrationData = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    username: firstName, // Assuming username is the same as first name
    password: password,
    confirm_password: confirmPassword,
  };

  // useEffect(()=>{
  //   const  token=localStorage.getItem('access_token')
  //   if(token){
  //     navigate('/home')
  //   } 
  // },[navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(registrationData);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl.API_URL}accounts/register/`, registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const data = response.data;
        setSuccess(data.message || 'User registered successfully');

        // Save tokens if they exist
        if (data.access) localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

        navigate('/login');
      }
    } catch (err) {
      if (err.response) {
        const errorData = err.response.data;
        setError(
          errorData.message ||
          errorData.email?.[0] ||
          errorData.password?.[0] ||
          'Registration failed. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" className="btn">Register</button>
        </form>
        <p className="footer-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

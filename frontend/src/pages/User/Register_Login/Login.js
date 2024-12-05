import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../static/css/Login.css';
import axios from 'axios';
import { BaseUrl } from '../../../utils/config';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/user/userSlice';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    
    

    const  LoginData = {
      email : email,
      password : password
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        setError('Please fill in both fields');
      } else {
        const res =  await axios.post(`${BaseUrl.API_URL}accounts/login/`,LoginData,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (res.status === 200){
          const { access, refresh , user, message } = res.data;
          console.log("user is :",user)
          console.log("at is :",access)
          console.log("rt is :",refresh)
          localStorage.setItem('access_token',access);
          localStorage.setItem('refresh_token', refresh);
          
          dispatch(
          setUser({
            user,
          })
        );
        }
        navigate('/home/')
        console.log('Login:', { email, password });
      }
    };
  
  return (
    <div className="login-container">
    <div className="login-form">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  </div>
  )
}

export default Login
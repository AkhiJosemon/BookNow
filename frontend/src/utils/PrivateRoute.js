import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Function to decode JWT token and check expiration
function isTokenExpired(token) {
  if (!token) return true; // If there's no token, treat it as expired.

  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
  return decodedToken.exp * 1000 < Date.now(); // Compare expiry time with current time
}

// Function to refresh the access token using the refresh token
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch('/api/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  return data.access; // Return the new access token
}

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          // Attempt to refresh the access token if expired
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            localStorage.setItem('access_token', newAccessToken); // Store new access token
            setIsAuthenticated(true); // Token refreshed, authenticated
          } else {
            // No refresh token, redirect to login
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token refresh failed', error);
          setIsAuthenticated(false); // Token refresh failed, not authenticated
        }
      } else {
        
        setIsAuthenticated(true);
      }

      setLoading(false); // Done checking
    };

    checkTokenValidity();
  }, []);

  if (loading) {
    
    return <div>Loading...</div>; // Show loading state while checking token validity
  }

  return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;

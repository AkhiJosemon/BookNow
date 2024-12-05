import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../static/css/Payment.css';
import axios from 'axios';
import { BaseUrl } from '../../../utils/config';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const formatTo24HourTime = (time) => {
    const [hours, minutes] = time.split(/[:\s]/);
    const modifier = time.split(' ')[1];
    
    let formattedHours = parseInt(hours, 10);
    if (modifier === 'PM' && formattedHours !== 12) {
      formattedHours += 12;
    } else if (modifier === 'AM' && formattedHours === 12) {
      formattedHours = 0;
    }
  
    return `${String(formattedHours).padStart(2, '0')}:${minutes}`;
  };
  

  // Destructure booking details from the location state
  const { movieTitle, selectedDate, selectedTime, selectedTheater, selectedSeats, totalPrice } = location.state || {};
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Function to handle payment success actions
  const successPayment = async (orderID) => {
    try {
      const formattedTime = formatTo24HourTime(selectedTime);
      const token= localStorage.getItem("access_token")
      const response = await axios.post(`${BaseUrl.API_URL}book/save-payment-details/`, {
        orderID,
        movieTitle,
        selectedDate,
        selectedTime : formattedTime, 
        selectedTheater,
        selectedSeats,
        totalPrice,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status !== 201) {
        console.error('Error:', response.data.error || 'Unknown error');
        alert('Payment failed, please try again');
      } else {
        alert('Payment and booking details saved successfully!');
        navigate(`/ticket/${orderID}`);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('There was an issue with the payment. Please try again.');
    }
  };

  const handleError = (error) => {
    console.error('Payment Error:', error);
    alert('There was an issue processing your payment. Please try again.');
  };

  return (
    <div className="payment-page">
      <h2>Complete Your Payment</h2>
      
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p><strong>Movie:</strong> {movieTitle}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Time:</strong> {selectedTime}</p>
        <p><strong>Theater:</strong> {selectedTheater}</p>
        <p><strong>Seats:</strong> {selectedSeats?.join(', ')}</p>
        <p><strong>Total Price:</strong> ₹{totalPrice}</p>
      </div>

      <div className="paypal-button-container">
        <PayPalScriptProvider options={{ "client-id": "AfN4VriBSARXtAYmtsL3A1lVNMEygWQfh4d99oqzYpUwSwaIOqaQX-lUvWw_hb3cv-k5_ZyvqO4k3GHN" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: (totalPrice / 82).toFixed(2) // Convert to USD (example: 1 USD = 82 INR)
                  },
                  description: `Booking for ${movieTitle} at ${selectedTheater} on ${selectedDate}`
                }]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                successPayment(details.id); // Call successPayment on successful transaction
              });
            }}
            onError={(err) => handleError(err)}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}

export default PaymentPage;

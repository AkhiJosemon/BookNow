import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../static/css/Ticket.css'; // Add your styling here
import { BaseUrl } from '../../../utils/config';

function TicketPage() {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`${BaseUrl.API_URL}book/get-ticket-details/${orderID}/`);
        if (response.ok) {
          const data = await response.json();
          setTicketDetails(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Unable to fetch ticket details.');
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setError('Unable to fetch ticket details. Please try again.');
      }
    };

    fetchTicketDetails();
  }, [orderID]);

  const handleHomeClick = () => {
    navigate('/'); // Navigate to the homepage
  };

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button className="home-button" onClick={handleHomeClick}>
          Go to Home
        </button>
      </div>
    );
  }

  if (!ticketDetails) {
    return <div className="loading">Loading ticket details...</div>;
  }

  return (
    <div className="ticket-page">
      <h2>Your Movie Ticket</h2>
      <div className="ticket-card">
        <h3>{ticketDetails.movieTitle}</h3>
        <p><strong>Date:</strong> {ticketDetails.selectedDate}</p>
        <p><strong>Time:</strong> {ticketDetails.selectedTime}</p>
        <p><strong>Theater:</strong> {ticketDetails.selectedTheater}</p>
        <p><strong>Seats:</strong> {JSON.parse(ticketDetails.selectedSeats).join(', ')}</p>
        <p><strong>Total Price:</strong> ₹{ticketDetails.totalPrice}</p>
        <p><strong>Order ID:</strong> {ticketDetails.orderID}</p>
        <p><strong>Booked On:</strong> {new Date(ticketDetails.createdAt).toLocaleString()}</p>
      </div>
      <button className="home-button" onClick={handleHomeClick}>
        Go to Home
      </button>
    </div>
  );
}

export default TicketPage;

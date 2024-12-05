import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../../utils/config';
import '../../../static/css/TicketList.css';
import axios from 'axios';

function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Fetch token from localStorage
      const response = await axios.get(`${BaseUrl.API_URL}book/user/tickets/`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      
      if (response.status === 200) {
        const data = response.data;
        setTickets(data);
      } else {
        setError('Unable to fetch tickets.');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Unable to fetch tickets. Please try again.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (orderID) => {
    navigate(`/ticket/${orderID}`);
  };

  return (
    <div className="ticket-list-page">
      <h2>Your Tickets</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {tickets.length === 0 ? (
        <div className="no-tickets-message">You have no tickets booked yet.</div>
      ) : (
        <div className="ticket-list">
          {tickets.map(ticket => (
            <div className="ticket-card" key={ticket.orderID} onClick={() => handleTicketClick(ticket.orderID)}>
              <h3>{ticket.movieTitle}</h3>
              <p><strong>Date:</strong> {ticket.selectedDate}</p>
              <p><strong>Time:</strong> {ticket.selectedTime}</p>
              <p><strong>Theater:</strong> {ticket.selectedTheater}</p>
              <p><strong>Seats:</strong> {JSON.parse(ticket.selectedSeats).join(', ')}</p>
              <p><strong>Total Price:</strong> ₹{ticket.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketListPage;

import React, { useEffect, useState } from 'react';
import '../../../static/css/Booking.css';
import { useParams, useNavigate } from 'react-router-dom'; 
import { BaseUrl } from '../../../utils/config';
import axios from 'axios';

function Booking() {
  const [totalSeats, setTotalSeats] = useState(0); 
  const [seats, setSeats] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDetails, setShowDetails] = useState('');
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const navigate = useNavigate();

  const SEAT_PRICE = 150; // Price per seat in ₹

  useEffect(() => {
    getMovieDetails();
    getShowtimes();
  }, []);

  const getShowtimes = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.get(`${BaseUrl.API_URL}movies/get_show_details/`, {
        params: { movieId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowDetails(res.data[0]);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    }
  };

  const getMovieDetails = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.get(`${BaseUrl.API_URL}movies/movie_details/`, {
        params: { movieId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMovie(res.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleTheaterChange = (theater) => {
    setSelectedTheater(theater);
    const selectedTheaterData = showDetails?.theaters?.find(
      (t) => t.name === theater
    );
    setTotalSeats(selectedTheaterData?.capacity || 0);
    setSeats(Array(selectedTheaterData?.capacity).fill('available'));
  };

  const toggleSeat = (index) => {
    if (seats[index] === 'available') {
      const newSeats = [...seats];
      newSeats[index] = 'selected';
      setSeats(newSeats);
      setSelectedSeats([...selectedSeats, index]);
    } else if (seats[index] === 'selected') {
      const newSeats = [...seats];
      newSeats[index] = 'available';
      setSeats(newSeats);
      setSelectedSeats(selectedSeats.filter((seat) => seat !== index));
    }
  };

  const submitBooking = () => {
    if (selectedSeats.length > 0 && selectedTime && selectedTheater && selectedDate) {
      const confirmBooking = window.confirm(
        `Confirm booking for seats: ${selectedSeats.join(', ')} at ${selectedTheater} on ${selectedDate} at ${selectedTime}?\nTotal Price: ₹${selectedSeats.length * SEAT_PRICE}`
      );
      if (confirmBooking) {
        navigate('/payment', {
          state: {
            movieTitle: movie.title,
            selectedDate,
            selectedTime,
            selectedTheater,
            selectedSeats,
            totalPrice: selectedSeats.length * SEAT_PRICE // Pass the total price
          }
        });
      }
    } else {
      alert('Please select all fields and at least one seat');
    }
  };

  const showDateStart = showDetails?.show_date_start || '';
  const showDateEnd = showDetails?.show_date_end || '';

  return (
    <div className="booking-page">
      <div className="movie-info">
        {movie.poster ? (
          <img
            src={`${BaseUrl.API_URL}${movie.poster}`}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="loading">Loading movie poster...</div>
        )}
        <h2 className="movie-title">{movie.title}</h2>
      </div>

      <div className="booking-container">
        <div className="seat-booking">
          <h2>Choose Your Seats</h2>
          <div className="filters">
            <select
              className="dropdown"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {showDetails?.show_times?.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <select
              className="dropdown"
              value={selectedTheater}
              onChange={(e) => handleTheaterChange(e.target.value)}
            >
              <option value="">Select Theater</option>
              {showDetails?.theaters?.map((theater, index) => (
                <option key={index} value={theater.name}>
                  {theater.name} (Capacity: {theater.capacity})
                </option>
              ))}
            </select>

            <input
              type="date"
              className="dropdown"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={showDateStart}
              max={showDateEnd}
            />
          </div>

          <div className="seat-grid">
            {seats.map((seat, index) => (
              <div
                key={index}
                className={`seat ${seat}`}
                onClick={() => toggleSeat(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p><strong>Movie:</strong> {movie.title}</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Theater:</strong> {selectedTheater}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
          <p><strong>Total Price:</strong> ₹{selectedSeats.length * SEAT_PRICE}</p>
          <button onClick={submitBooking} className="book-button">Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
}

export default Booking;

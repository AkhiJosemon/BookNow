import React, { useEffect, useState } from 'react';
import '../../../static/css/MovieList.css'; // CSS file for styling
import { BaseUrl } from '../../../utils/config';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const MovieList = ({ selectedFilter }) => {
  const [movies, setMovies] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    const token = localStorage.getItem('access_token');

    try {
      const res = await axios.get(`${BaseUrl.API_URL}movies/all_movies_details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        setMovies(res.data.movies);
        console.log("#####",res.data.movies)
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleBookClick = (movieId) =>{
    navigate(`/booking/${movieId}`);
  }

  // Filter movies based on selected filter
  const filteredMovies = selectedFilter
    ? movies.filter((movie) => movie.category === selectedFilter)
    : movies;

  // Group movies by language
  const moviesByLanguage = filteredMovies.reduce((groups, movie) => {
    const { language } = movie;
    if (!groups[language]) {
      groups[language] = [];
    }
    groups[language].push(movie);
    return groups;
  }, {});

  return (
    <div className="movie-list">
      <h2>Movies by Language</h2>
      {Object.keys(moviesByLanguage).map((language) => (
        <div key={language}>
          <h3>{language}</h3>
          <div className="movies-container">
            {moviesByLanguage[language].map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`${BaseUrl.API_URL}${movie.poster}`}
                  alt={movie.title}
                  className="movie-poster"
                  style={{ height: '100%', width :'100%'}}
                />
                <h3 className="movie-title">{movie.title}</h3>
               
                <button
                  className="book_button"
                  style={{ backgroundColor: 'rgb(44, 151, 131)', color: 'white' }}
                  onClick={() => handleBookClick(movie.id)}
                >
                  BOOK NOW
                </button>
                
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;

import React, { useState } from 'react';
import '../../../static/css/Navbar.css'; // Make sure to create a separate CSS file for styling
import { FaUserCircle } from 'react-icons/fa';

const NavBar = ({ toggleSideBar, setSelectedFilter }) => {
  const [showFilter, setShowFilter] = useState(false);



  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilter = (filter) =>{
    setSelectedFilter(filter);
    setShowFilter(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <button className="filter-btn" onClick={toggleFilter}>
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {/* Dropdown Filter Options */}
        {showFilter && (
          <div className="filter-dropdown">
             <p onClick={() => applyFilter('AC')}>Action</p>
            <p onClick={() => applyFilter('TH')}>Thriller</p>
            <p onClick={() => applyFilter('DR')}>Drama</p>
            <p onClick={() => applyFilter('CO')}>Comedy</p>
            <p onClick={() => applyFilter('RO')}>ROMANCE</p>


            <p onClick={() => applyFilter('')}>All</p>
          </div>
        )}
      </div>
      
      <div className="navbar-center">
        <h1>BOOK NOW</h1>
      </div>
      
      <div className="navbar-right">
        {/* When the icon is clicked, it calls the toggleSideBar function */}
        <FaUserCircle size={30} className="account-icon" onClick={toggleSideBar} />
      </div>
    </nav>
  );
};

export default NavBar;

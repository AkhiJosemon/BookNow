import React, { useEffect, useState } from 'react';
import '../../../static/css/Sidebar.css'; // Styling file for the sidebar
import { FaEdit, FaSignOutAlt,FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../../utils/config';
import axios from 'axios';
const SideBar = ({ setSideBarVisible , userDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const navigate = useNavigate();

 

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const closeSidebar = () => {
    setSideBarVisible(false);
  } 

  const handleSave = () => {
    const token = localStorage.getItem('access_token');
    const res = axios.put(`${BaseUrl.API_URL}accounts/update_user/`,{ first_name: editedFirstName, last_name: editedLastName },{
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        'Content-Type': 'application/json',
    },
    })
    setEditedFirstName(editedLastName);
    setEditedLastName(editedLastName);
    setIsEditing(false);
  };

  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate('/login/')
    alert('Logging out...');
  };

  const handleBookedShowsClick = () => {
    navigate('/booked-shows'); // Redirect to the booked shows page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
      <button className="close-btn" onClick={closeSidebar}>
          <FaTimes size={20} /> {/* Close icon */}
        </button>
        <h2>User Info</h2>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Username:</strong>{userDetails.username}</p>
        
        {/* Editable fields */}
        <div className="name-edit">
          <div>
            <strong>First Name:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                value={editedFirstName} 
                onChange={(e) => setEditedFirstName(e.target.value)} 
              />
            ) : (
              <span>{userDetails .first_name}</span>
            )}
          </div>
          <div>
            <strong>Last Name:</strong>
            {isEditing ? (
              <input 
                type="text" 
                value={editedLastName} 
                onChange={(e) => setEditedLastName(e.target.value)} 
              />
            ) : (
              <span>{userDetails .last_name}</span>
            )}
          </div>
        </div>

        
        <div className="sidebar-buttons">
        <button onClick={isEditing ? handleSave : handleEditClick} className="edit-btn">
            {/* {loading ? 'Saving...' : <FaEdit />} */}
            {isEditing ? ' Save' : ' Edit'}
          </button>
          <div className="button-container">
          <button 
  className="btn-booked-shows" 
  onClick={handleBookedShowsClick} 
  style={{ backgroundColor:"Blue" ,color:"white"}}
>
  Booked Shows
</button>
      </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default SideBar;

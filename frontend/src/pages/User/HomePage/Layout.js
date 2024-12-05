import React, { useState , useEffect} from 'react';
import NavBar from './NavBar';
import MovieList from './MovieList';
import SideBar from './SideBar';
import '../../../static/css/Layout.css';
import { BaseUrl } from '../../../utils/config';
import axios from 'axios';

function Layout() {
    const [isSideBarVisible, setSideBarVisible] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const[selectedFilter , setSelectedFilter] = useState('');


    useEffect (()=>{
        getUserDetails();
    },[]);
    const getUserDetails = async()=>{
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.get(`${BaseUrl.API_URL}accounts/get_user_details/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                    'Content-Type': 'application/json',
                },
            });
    
            if (res.status === 200) {
                setUserDetails(res.data); // Set user details state
                console.log("User details:", res.data);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            // Optionally handle token expiration or other errors here
        }
    }
    // Toggle sidebar visibility when account icon is clicked
    const toggleSideBar = () => {
      setSideBarVisible(!isSideBarVisible);
    };

    return (
        <div className="layout-container" >
            <NavBar toggleSideBar={toggleSideBar}  setSelectedFilter={setSelectedFilter}/>
            <div className="content">
                <MovieList selectedFilter={selectedFilter} />


                {isSideBarVisible && <SideBar 
                    setSideBarVisible={setSideBarVisible}
                    userDetails={userDetails}
                    setUserDetails= {setUserDetails}
                   
                    />}

                    
            </div>
        </div>
    );
}

export default Layout;

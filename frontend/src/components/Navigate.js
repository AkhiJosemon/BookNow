import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "../pages/User/Register_Login/Register.js";
import Login from "../pages/User/Register_Login/Login.js";
import Layout from '../pages/User/HomePage/Layout.js';

import PrivateRoute from '../utils/PrivateRoute.js';
import Booking from '../pages/User/Booking/Booking.js';
import PaymentPage from '../pages/User/Booking/PaymentPage.js';
import TicketPage from '../pages/User/Booking/TicketPage.js';
import TicketListPage from '../pages/User/Booking/TicketListPage.js';

function Navigate() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/home" element={<Layout />} /> */}

        <Route path="/home" element={<PrivateRoute> <Layout /> </PrivateRoute>} />
        <Route path="" element={<PrivateRoute><Layout /></PrivateRoute>} />
        <Route path="/booking/:movieId" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/ticket/:orderID/" element={<PrivateRoute><TicketPage/></PrivateRoute>} />
        <Route path="/booked-shows" element={<PrivateRoute><TicketListPage/></PrivateRoute>} />





      </Routes>
    </Router>
  );
}

export default Navigate;

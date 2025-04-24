import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import Login from './landing_page/login/Login';
import Signup from './landing_page/signup/Signup';
import Collabs from './landing_page/my_collabrations/Collabs';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import Notfound from './landing_page/NotFound';
import CollabDetails from './landing_page/my_collabrations/CollabDetails';
import Collabform from './landing_page/Collabform';
import JoinCollaborationForm from './landing_page/JoinCollaborationForm';
import Chatbot from './landing_page/Chatbot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className="app-wrapper">
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/collabs' element={<Collabs />} />
          <Route path="/collabs/:id" element={<CollabDetails />} />
          
          <Route path="/collabs/create" element={<Collabform/>} />
          <Route path="/joinForm" element={<JoinCollaborationForm/>} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <Chatbot/>
      <Footer />
    </BrowserRouter>
  </div>
);

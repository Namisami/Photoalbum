import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './Logout.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function Logout(props) {
  useEffect(() => {
    localStorage.clear();
    return props.onLogout();
  });

  return ( 
      <div className='container'>
        <h1 className='text-center my-5'>Вы успешно вышли из аккаунта</h1>
      </div>
  );
}

export default Logout;

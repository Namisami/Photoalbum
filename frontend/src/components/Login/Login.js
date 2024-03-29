import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './Login.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function Login(props) {
  const [formValue, setFormValue] = useState({
    'email': '',
    'password': '',
  });
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/auth/login/`;

    const formData = new FormData();
    formData.append("email", formValue["email"]);
    formData.append("password", formValue["password"]);

    let resData;
    
    await axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(res => resData = res.data);
      
    let token = `Token ${resData.token}`;
    localStorage.setItem('token', JSON.stringify(token));
    return props.onLogin();
  }

  const handleFormValueChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  }

  return ( 
      <div className="container">
        <form method='post'
          className='my-5'
          onSubmit={ postEntry }
        >
          <FormInput 
            name='email' 
            type='email' 
            title='Email' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          <FormInput 
            name='password' 
            type='password'
            title='Пароль' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          <button
            className='btn btn-primary'
            type='submit'>
              Отправить
          </button>
        </form>
      </div>
  );
}

export default Login;

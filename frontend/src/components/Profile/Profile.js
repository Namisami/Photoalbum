import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './Profile.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';
const API_URL_AVATAR = 'http://127.0.0.1:9000';


function Profile(props) {
  const [formValue, setFormValue] = useState({
    'email': '',
    'password': '',
  });

  const [user, setUser] = useState(0)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/auth/login/`;

    const formData = new FormData();
    formData.append("email", formValue["email"]);
    formData.append("password", formValue["password"]);

    let userData;
    
    await axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(res => userData = res.data.user);
    
    console.log(userData);
    return localStorage.setItem('user', userData);
  }

  const handleFormValueChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  }

  return ( 
      <div className="form">
        <img src={`${ API_URL_AVATAR }${ user.photo }`} width='500' alt='User avatar'></img>
        <p>{ user.first_name } { user.last_name }</p>
        <form method='post'
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
            title='Пароль' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          <button
            type='submit'>
              Отправить
          </button>
        </form>
      </div>
  );
}

export default Profile;

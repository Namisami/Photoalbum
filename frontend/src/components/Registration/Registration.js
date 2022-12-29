import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './Registration.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function Registration(props) {

  const [formValue, setFormValue] = useState({
    'email': '',
    'password': '',
    'first_name': '',
    'last_name': '',
  });

  const params = useParams()
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/auth/register/`;

    const formData = new FormData();
    formData.append("email", formValue["email"]);
    formData.append("password", formValue["password"]);
    formData.append("first_name", formValue["first_name"]);
    formData.append("last_name", formValue["last_name"]);
    
    await axios
      .post(url, formData, {
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(res => console.log(res.data));
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
            name='first_name' 
            title='Имя' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          <FormInput 
            name='last_name' 
            title='Фамилия' 
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
            className='btn btn-primary'
            type='submit'>
              Отправить
          </button>
        </form>
      </div>
  );
}

export default Registration;

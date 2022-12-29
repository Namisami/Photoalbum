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
    'photo': '',
    'bio': '',
  });

  const [passwordFormValue, setPasswordFormValue] = useState({
    'old_password': '',
    'password': '',
    'password_again': '',
  })

  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [passwordIsEdit, setPasswordIsEdit] = useState(false);

  useEffect(() => {
    getUser();
  }, [])

  const getUser = async () => {
    const url = `${API_URL}/users/`;
    const token = localStorage.token;

    let userData;

    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        },
      })
      .then(res => userData = res.data);
    console.log(userData)
    // userData = JSON.parse(userData)
    // localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData);
  }
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/users/${ user.id }/`;
    const token = localStorage.token;

    const formData = new FormData();
    
    for (let key in formValue) {
      if (key) {
        formData.append(key, formValue[key]);
      }
    }

    let userData;
    
    await axios
      .patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${JSON.parse(token)}`,
        },
      })
      .then(res => userData = res.data);
    
    console.log(userData);
    return setUser(userData);
  }

  const changePassword = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/users/${ user.id }/set_password/`;
    const token = localStorage.token;

    const formData = new FormData();
    for (let key in passwordFormValue) {
      if (key) {
        formData.append(key, passwordFormValue[key]);
      }
    }
    let userData;
    
    await axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${JSON.parse(token)}`,
        },
      })
      .then(res => userData = res.data);
    
    console.log(userData);
    // return setUser(userData);
  }

  const handleEditClick = () => {
    if (passwordIsEdit) {
      setPasswordIsEdit(!passwordIsEdit);
    }
    setIsEdit(!isEdit);
  }

  const handlePasswordEditClick = () => {
    if (isEdit) {
      setIsEdit(!isEdit);
    }
    setPasswordIsEdit(!passwordIsEdit);
  }

  // const handleFormValueChange = (e) => {
  //   if (e.target.name == 'subcategory') {
  //     let newSubcategory = [];
  //     for (let value of e.target.value.split(" ")) {
  //       newSubcategory.push(value)
  //     }
  //     setFormValue({ ...formValue, [e.target.name]: newSubcategory });
  //   } else if (e.target.name == 'photo_file') {
  //     setFormValue({ ...formValue, [e.target.name]: e.target.files[0] })
  //   } else {
  //     setFormValue({ ...formValue, [e.target.name]: e.target.value });
  //   }
  // }
  const handleFormValueChange = (e) => {
    if (e.target.name == 'photo') {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] })
    } else {
      setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  }

  const handlePasswordFormValueChange = (e) => {
    setPasswordFormValue({ ...passwordFormValue, [e.target.name]: e.target.value });
  }

  return ( 
      <div className="container d-flex justify-content-center">
        <div className='w-50 my-5'>
          <div className='card shadow'>
            <img className='card-img-top' src={`${ user.photo }`} alt='User avatar'></img>
            <div className='card-body'>
              <p className='card-text m-1 alert alert-primary'>{ user.first_name } { user.last_name }</p>
              <p className='card-text m-1 alert alert-light'>{ user.bio }</p>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2'>
            <button className='btn btn-primary' onClick={ handleEditClick }>
              { !isEdit
                ? 'Изменить данные'
                : 'Скрыть'
              }
            </button>
            <button className='btn btn-primary' onClick={ handlePasswordEditClick }>
            { !passwordIsEdit
                ? 'Изменить пароль'
                : 'Скрыть'
              }
            </button>
          </div>
          { passwordIsEdit &&
            <form method='post'
              onSubmit={ changePassword }
            >
              <FormInput 
                name='old_password' 
                type='password' 
                title='Старый пароль' 
                onChangeValue={ handlePasswordFormValueChange } 
              />
              <br />
              <FormInput 
                name='password' 
                type='password'
                title='Новый пароль' 
                onChangeValue={ handlePasswordFormValueChange } 
              />
              <br />
              <FormInput 
                name='password_again' 
                type='password'
                title='Новый пароль (повторите)' 
                onChangeValue={ handlePasswordFormValueChange } 
              />
              <br />
              <button
                className='btn btn-primary w-100'
                type='submit'>
                  Отправить
              </button>
            </form>
          }
          { isEdit &&
            <form method='patch'
              onSubmit={ postEntry }
            >
              <FormInput 
                name='photo' 
                type='file' 
                title='Аватарка' 
                onChangeValue={ handleFormValueChange } 
              />
              <br />
              <FormInput 
                name='bio' 
                title='О себе' 
                onChangeValue={ handleFormValueChange } 
              />
              <br />
              <button
                className='btn btn-primary w-100'
                type='submit'>
                  Отправить
              </button>
            </form>
          }
        </div>
      </div>
  );
}

export default Profile;

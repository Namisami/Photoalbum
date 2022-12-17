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

  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

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

  const editProfile = async (e) => {
    e.preventDefault();
  }
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/users/${ user.id }/`;
    const token = localStorage.token;

    const formData = new FormData();
    // if (photo) {
    //   formData.append("photo", formValue["photo"]);
    // }
    // if (bio)
    for (let key in formValue) {
      if (key) {
        formData.append(key, formValue[key]);
      }
    }
    // formData.append("password", formValue["password"]);

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

  const handleEditClick = () => {
    setIsEdit(true);
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

  return ( 
      <div className="form">
        <img src={`${ user.photo }`} width='500' alt='User avatar'></img>
        <p>{ user.first_name } { user.last_name }</p>
        <p>{ user.email }</p>
        <p>{ user.bio }</p>
        <button onClick={ handleEditClick }>Изменить данные</button>
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
              type='submit'>
                Отправить
            </button>
          </form>
        }
      </div>
  );
}

export default Profile;

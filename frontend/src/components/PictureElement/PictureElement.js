import React, { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './PictureElement.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function PictureList(props) {
  const [pictureInfo, setPictureInfo] = useState(0);

  const [formValue, setFormValue] = useState({
    'photo_file': undefined,
    'description': '',
    'author': '',
    'category': '',
    'subcategory': []
  });

  const params = useParams()
  
  const getPictureInfo = async () => {
    const url = `${API_URL}/pictures/${params.pictureId}`;
    let token = localStorage.token;
    let pictureInfo;
    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => pictureInfo = response.data);
    return setPictureInfo(pictureInfo);
  };
    
  useEffect(() => {
    getPictureInfo();
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/`;
    let token = localStorage.token;

    const formData = new FormData();
    formData.append("photo_file", formValue["photo_file"], formValue["photo_file"].name);
    formData.append("description", formValue["description"]);
    formData.append("author.nickname", formValue["author"]);
    formData.append("category.title", formValue["category"]);
    for (let subcat of formValue["subcategory"]) {
      formData.append("subcategory", subcat);
    }
    
    await axios
      .post(url, formData, {
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getPictureInfo();
  }

  const subcategoryInput = () => {
    if (formValue["category"]) {
      return (
        <FormInput 
            name='subcategory' 
            title='Подкатегории' 
            onChangeValue={ handleFormValueChange } 
          />
      )
    } else {
      return
    }
  }

  const handleFormValueChange = (e) => {
    if (e.target.name == 'subcategory') {
      let newSubcategory = [];
      for (let value of e.target.value.split(" ")) {
        newSubcategory.push(value)
      }
      setFormValue({ ...formValue, [e.target.name]: newSubcategory });
    } else if (e.target.name == 'photo_file') {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] })
    } else {
      setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  }

  // const handleAuthorChange = (e) => {
  //   setAuthor(e.target.value);
  // }

  // const handleCategoryChange = async(e) => {
  //   setCategory(e.target.value);
  // }

  // const handleDescriptionChange = (e) => {
  //   setDescription(e.target.value);
  // }

  // const handleSubcategoryChange = (e) => {
  //   let newSubcategory = [];
  //   for (let value of e.target.value.split(" ")) {
  //     newSubcategory.push(value)
  //   }
  //   console.log(newSubcategory);
  //   setSubcategory(newSubcategory);
  // }
  
  // const handlePhotoFileChange = (e) => {
  //   setPhotoFile(e.target.files[0]);
  // }

  return ( 
      <div className="App">
        <p>Список говна</p>
        <div>
          <img width='500' src={ pictureInfo.photo_file }></img>
        </div>
        <button onClick={ getPictureInfo }>Update</button>
        <form method='post'
          onSubmit={ postEntry }
        >
          {/* <label>
            Изображение <br />
            <input
              name='photo_file'
              id="photoFile" 
              type='file'
              accept='image/jpeg,image/png,image/jpg'
              onChange={ handlePhotoFileChange }
            />
          </label> */}
          <FormInput 
            name='photo_file' 
            type='file' 
            title='Изображение' 
            onChangeValue={ handleFormValueChange } 
            // onChange={ handlePhotoFileChange }
          />
          <br />
          {/* <label>
            Описание <br />
            <input
              name='description'
              id="description"
              onChange={ handleDescriptionChange }
            />
          </label> */}
          <FormInput 
            name='description' 
            title='Описание' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          {/* <label>
            Автор <br />
            <input
              name='author'
              id="author" 
              onChange={ handleAuthorChange }
            />
          </label> */}
          <FormInput 
            name='author' 
            title='Автор' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          {/* <label>
            Категория <br />
            <input
              name='category'
              id="category" 
              onChange={ handleCategoryChange }
            />
          </label> */}
          <FormInput 
            name='category' 
            title='Категория' 
            onChangeValue={ handleFormValueChange } 
          />
          <br />
          { subcategoryInput() }
          <br />
          <button
            type='submit'>
              Отправить
          </button>
        </form>
      </div>
  );
}

export default PictureList;

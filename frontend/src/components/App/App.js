import React, { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './App.css';
import axios from 'axios';
import Header from '../Header/Header';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function App() {
  const [pictureList, setPictureList] = useState(0);

  const [formValue, setFormValue] = useState({
    'photo_file': undefined,
    'description': '',
    'author': '',
    'category': '',
    'subcategory': []
  });

  // const [photoFile, setPhotoFile] = useState();
  // const [description, setDescription] = useState(0);
  // const [author, setAuthor] = useState(0);
  // const [category, setCategory] = useState(0);
  // const [subcategory, setSubcategory] = useState([]);
  
  const getPictures = async () => {
    const url = `${API_URL}/pictures/`;
    let pictureList;
    let token = localStorage.getItem('token');
    await axios
      .get(url, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(token)}`,
        }
      })
      .then(response => pictureList = response.data);
    console.log(pictureList);
    return setPictureList(pictureList);
  };
    
  useEffect(() => {
    getPictures();
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/`;

    // const formData = new FormData();
    // formData.append("photo_file", photoFile, photoFile.name);
    // formData.append("description", description);
    // formData.append("author.nickname", author);
    // formData.append("category.title", category);
    // for (let subcat of subcategory) {
    //   formData.append("subcategory", subcat);
    // }

    const formData = new FormData();
    formData.append("photo_file", formValue["photo_file"], formValue["photo_file"].name);
    formData.append("description", formValue["description"]);
    formData.append("author.nickname", formValue["author"]);
    formData.append("category.title", formValue["category"]);
    for (let subcat of formValue["subcategory"]) {
      formData.append("subcategory", subcat);
    }

    let token = localStorage.getItem('token');
    
    await axios
      .post(url, formData, {
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getPictures();
  }

  const picturePropsList = Array.from({pictureList}.pictureList).map((picture) => {
    return (
      <li key={picture.id}>
        <a href={picture.id}>
          <img width="100" src={`${picture.photo_file}`} alt='Album element' />
          <p>{picture.url}</p>
        </a>
      </li>
    )
  });

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
        <ul>{ picturePropsList }</ul>
        <button onClick={ getPictures }>Update</button>
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

export default App;

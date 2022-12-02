import React, { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './App.css';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function App() {
  const [pictureList, setPictureList] = useState(0);

  const [photoFile, setPhotoFile] = useState();
  const [author, setAuthor] = useState(0);
  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState(0);
  const [subcategory, setSubcategory] = useState([]);
  
  const getPictures = async () => {
    const url = `${API_URL}/pictures/`;
    let pictureList;
    await axios
      .get(url)
      .then(response => pictureList = response.data);
    return setPictureList(pictureList);
  };
    
  useEffect(() => {
    getPictures();
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/`;

    const formData = new FormData();
    formData.append("photo_file", photoFile, photoFile.name);
    formData.append("description", description);
    formData.append("author.nickname", author);
    formData.append("category.title", category);
    for (let subcat of subcategory) {
      formData.append("subcategory", subcat);
    }
    // formData.append("subcategory.title", subcategory);

    // let subc = [];
    // for (let sub of subcategory) {
    //   let su = {
    //     'title': sub
    //   };
    //   subc.push(su);
    //   console.log(subc)
    // };
    
    await axios
      .post(url, formData
        // photo_file: photoFile,
        // description: description,
        // 'author.nickname': author,
        // 'category.title': category,
        // 'subcategory.title': subcategory[0],
        // 'subcategory.title': subcategory[1],
        // 'subcategory': {'title': subcategory},
      , {
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(res => console.log(res.data));
    
    return getPictures();
  }

  // console.log({pictureList});
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
    if (category) {
      return (
        <label>
            Подкатегории <br />
            <input
              name='subcategory'
              id="subcategory" 
              onChange={ handleSubcategoryChange }
            />
          </label>
      )
    } else {
      return
    }
  }

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value);
  }

  const handleCategoryChange = async(e) => {
    setCategory(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleSubcategoryChange = (e) => {
    let newSubcategory = [];
    for (let value of e.target.value.split(" ")) {
      newSubcategory.push(value)
    }
    console.log(newSubcategory);
    setSubcategory(newSubcategory);
  }
  
  const handlePhotoFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  }

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
          <FormInput name='photo_file' type='file' title='Изображение'/>
          <br />
          {/* <label>
            Описание <br />
            <input
              name='description'
              id="description"
              onChange={ handleDescriptionChange }
            />
          </label> */}
          <FormInput name='description' title='Описание' />
          <br />
          <label>
            Автор <br />
            <input
              name='author'
              id="author" 
              onChange={ handleAuthorChange }
            />
          </label>
          <br />
          <label>
            Категория <br />
            <input
              name='category'
              id="category" 
              onChange={ handleCategoryChange }
            />
          </label>
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

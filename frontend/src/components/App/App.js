import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './App.css';
import axios from 'axios';
import Header from '../Header/Header';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function App() {
  const [pictureList, setPictureList] = useState(0);
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  });

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
    const url = `${ API_URL }/pictures?page=${ page }`;
    let token = localStorage.getItem('token');
    let resData;
    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data);
    
    let pictureList = resData.results;

    setButtonActivity({
      previous: !!resData.previous,
      next: !!resData.next,
    })
    
    return setPictureList(pictureList);
  };
    
  useEffect(() => {
    getPictures();
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/`;
    let token = localStorage.getItem('token');

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
          'Content-Type': 'multipart/form-data',
          'Authorization': `${JSON.parse(token)}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getPictures();
  }

  const nextPage = () => {
    setPage(++page);
    return getPictures();
  };

  const previousPage = () => {
    setPage(--page);
    return getPictures();
  };

  const picturePropsList = Array.from({pictureList}.pictureList).map((picture) => {
    return (
      <div className='col' key={picture.id}>      
        <Link className='card shadow' to={`/pictures/${picture.id}`}>
          <img className='card-img-top object-fit-cover rounded' height="300" src={`${picture.photo_file}`} alt='Album element' />
        </Link>
      </div>
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

  return ( 
      <div className="container">
        <div className='mb-5 mt-2'>
          <h1 className='text-center'>Изображения</h1>
          <div className='d-flex justify-content-end my-2'>
            <div className='pagination d-flex my-auto'>
              <div 
                className={ buttonActivity.previous
                  ? 'page-item'
                  : 'page-item disabled'
                }
              >
                <input type='button' className='page-link' disabled={ !buttonActivity.previous } onClick={ previousPage } value={'<'}></input>
              </div>
              <div className='page-item'>
                <p className='page-link m-0'>{ page }</p>
              </div>
              <div
                className={ buttonActivity.next
                  ? 'page-item'
                  : 'page-item disabled'
                }
              >
                <input type='button' className='page-link' disabled={ !buttonActivity.next } onClick={ nextPage } value={'>'}></input>
              </div> 
            </div>
          </div>
          <div className='row row-cols-3 g-3'>
            { picturePropsList }
          </div>
          <form method='post'
            className='my-3'
            onSubmit={ postEntry }
          >
            <FormInput 
              name='photo_file' 
              type='file' 
              title='Изображение' 
              onChangeValue={ handleFormValueChange } 
            />
            <FormInput 
              name='description' 
              title='Описание' 
              onChangeValue={ handleFormValueChange } 
            />
            <FormInput 
              name='author' 
              title='Автор' 
              onChangeValue={ handleFormValueChange } 
            />
            <FormInput 
              name='category' 
              title='Категория' 
              onChangeValue={ handleFormValueChange } 
            />
            { subcategoryInput() }
            <button
              className='btn btn-primary'
              type='submit'>
                Отправить
            </button>
          </form>
        </div>
      </div>
  );
}

export default App;

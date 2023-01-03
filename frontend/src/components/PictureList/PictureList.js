import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import './PictureList.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function PictureList(props) {
  const [pictureList, setPictureList] = useState(0);
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  })

  const [formValue, setFormValue] = useState({
    'photo_file': undefined,
    'description': '',
    'author': '',
    'category': '',
    'subcategory': []
  });

  const params = useParams()
  
  const getPictures = async () => {
    const url = `${API_URL}/albums/${params.albumId}?page=${ page }`;
    let token = localStorage.token;
    let resData;

    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data.picture);
    
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

  const nextPage = () => {
    setPage(++page);
    return getPictures();
  };

  const previousPage = () => {
    setPage(--page);
    return getPictures();
  };

  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/albums/${params.albumId}/add_images/`;
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

  const picturePropsList = Array.from(pictureList).map((picture) => {
    return (
      <div className='col' key={ picture.id }>
        <Link className='card shadow' to={ `/pictures/${picture.id}` }>
          <img className='card-img-top object-fit-cover rounded' src={ picture.photo_file } height='300' alt='Album element' />
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
    if (e.target.name === 'subcategory') {
      let newSubcategory = [];
      for (let value of e.target.value.split(" ")) {
        newSubcategory.push(value)
      }
      setFormValue({ ...formValue, [e.target.name]: newSubcategory });
    } else if (e.target.name === 'photo_file') {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] })
    } else {
      setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  }

  return ( 
      <div className="container">
      { picturePropsList.length > 0
        ? <div className='my-2'>
            <h1 className='text-center'>Альбом</h1>
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
          </div>
        : <p className='alert alert-warning my-2'>Нет элементов</p>
      }
        <form method='post'
          className='mb-5'
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
  );
}

export default PictureList;

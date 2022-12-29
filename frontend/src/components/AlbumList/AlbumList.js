import React, { useEffect, useState } from 'react';
import './AlbumList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function AlbumList() {
  const [albumList, setAlbumList] = useState(0);

  let [isFilled, setIsFilled] = useState(false);
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  });

  const [currentAlbum, setCurrentAlbum] = useState(undefined);
  const [formValue, setFormValue] = useState({
    'title': '',
    'description': '',
    'cover': undefined,
  });

  const [postForm, setPostForm] = useState({
    'title': '',
    'description': '',
    'cover': undefined,
  });
  
  const getFilledAlbums = async (pageNum = page) => {
    const url = `${API_URL}/albums/filled_albums?page=${ pageNum }`;
    let token = localStorage.getItem('token');
    let resData;

    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data);
    
    let albumList = resData.results;

    setButtonActivity({
      previous: !!resData.previous,
      next: !!resData.next,
    })

    setIsFilled(true);
    return setAlbumList(albumList);
  };

  const getAlbums = async (pageNum = page) => {
    const url = `${ API_URL }/albums?page=${ pageNum }`;
    let token = localStorage.getItem('token');
    let resData;

    await axios
      .get(url, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data);
    
    console.log(resData);
    let albumList = resData.results;

    setButtonActivity({
      previous: !!resData.previous,
      next: !!resData.next,
    })

    setIsFilled(false);
    return setAlbumList(albumList);
  };
    
  useEffect(() => {
    getAlbums();
  }, [])

  const nextPage = () => {
    setPage(++page);
    return getAlbums();
  };

  const previousPage = () => {
    setPage(--page);
    return getAlbums();
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setCurrentAlbum(e.target.name);
  }

  const handleDeleteClick = async (e, id) => {
    e.preventDefault();
    // console.log(e.target.name);
    // setCurrentAlbum(e.target.name);
    deleteAlbum(id);
  }

  const handleFormValueChange = (e) => {
    if (e.target.name == 'cover') {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] })
    } else {
      setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  }

  const handlePostFormChange = (e) => {
    if (e.target.name == 'cover') {
      setPostForm({ ...postForm, [e.target.name]: e.target.files[0] })
    } else {
      setPostForm({ ...postForm, [e.target.name]: e.target.value });
    }
  }

  const postAlbum = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/albums/`;
    let token = localStorage.getItem('token');

    const formData = new FormData();
    for (let key in postForm) {
      if (postForm[key]) {
        if (key == 'cover') {
          formData.append(key, postForm[key], postForm[key].name);
        } else {
          formData.append(key, postForm[key]);
        }
      }
    }
    
    await axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${JSON.parse(token)}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getAlbums();
  }

  const editAlbum = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/albums/${ currentAlbum }/`;
    let token = JSON.parse(localStorage.token);

    const formData = new FormData();
    for (let key in formValue) {
      if (formValue[key]) {
        if (key == 'cover') {
          formData.append(key, formValue[key], formValue[key].name);
        } else {
          formData.append(key, formValue[key]);
        }
      }
    }
    
    await axios
      .patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getAlbums();
  };

  const deleteAlbum = async (id) => {
    const url = `${API_URL}/albums/${ id }/`;
    let token = JSON.parse(localStorage.token);
    
    await axios
      .delete(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getAlbums();
  };

  const showAll = () => {
    setPage(1);
    getAlbums(1);
  };
  
  const showFilled = () => {
    setPage(1);
    getFilledAlbums(1);
  };

  const albumPropsList = Array.from({albumList}.albumList).map((album) => {
    console.log(album)
    return (
      <div className='col' key={album.id}>
        <Link className='card shadow text-decoration-none text-dark' to={ `${album.id}` }>
          <img className='card-img-top object-fit-cover shadow-sm' height={ 300 } src={`${album.cover}`} alt='Album element' />
          <div className='card-body'>
            <h5 className='card-title border-bottom pb-2'>
              { album.title }
            </h5>
            { album.description
              ? <p className='card-text'>{ album.description }</p>
              : <p className='card-text'>Нет описания</p>
            }
          </div>
          <div className='d-flex justify-content-between pb-2 px-2'>
            <button
              name={ album.id }
              className='btn btn-outline-secondary'
              onClick={ handleEditClick }
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Изменить
            </button>
            <button
              name={ album.id }
              className='btn btn-danger'
              onClick={ (e) => handleDeleteClick(e, album.id) }
            >
              Удалить
            </button>
          </div>
        </Link>
      </div>
    )
  });

  const editForm = () => {
    return (
      <div
        className='modal fade'
        id="editModal" 
        tabIndex="-1" 
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Изменить</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form method='post'
              onSubmit={ editAlbum }
              className='modal-body'
              tabIndex={-1}
            >
              <FormInput 
                name='title' 
                title='Название' 
                onChangeValue={ handleFormValueChange } 
              />
              <FormInput 
                name='description' 
                title='Описание' 
                onChangeValue={ handleFormValueChange } 
              />
              <FormInput 
                name='cover' 
                title='Обложка'
                type='file' 
                onChangeValue={ handleFormValueChange } 
              />
              <div className='d-flex justify-content-between m-0'>
                <button type='submit' className="btn btn-primary" data-bs-dismiss="modal">Сохранить</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  };

  return ( 
      <div className="container">
      { albumPropsList.length > 0
        ? <div className='mb-5 mt-2'>
            <h1 className='text-center'>Альбомы</h1>
            <div className='d-flex justify-content-between align-content-center my-2'>
              { isFilled
                ? <button className='btn btn-dark h-75' onClick={ showAll }>Показывать все</button>
                : <button className='btn btn-dark h-75' onClick={ showFilled }>Не показывать пустые</button>
              }
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
            <div className='row row-cols-3 g-3'>{ albumPropsList }</div>
            { editForm() }
          </div>
        : <p>Нет элементов</p>
      }
        <form method='post'
          className='mb-5'
          onSubmit={ postAlbum }
        >
          <FormInput 
            name='title'  
            title='Название' 
            onChangeValue={ handlePostFormChange } 
          />
          <FormInput 
            name='description' 
            title='Описание' 
            onChangeValue={ handlePostFormChange } 
          />
          <FormInput 
            name='cover' 
            type='file'
            title='Обложка' 
            onChangeValue={ handlePostFormChange } 
          />
          <button
            className='btn btn-primary'
            type='submit'>
              Отправить
          </button>
        </form>
      </div>
  );
}

export default AlbumList;

import React, { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import './PictureElement.css';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function PictureElement(props) {
  const [pictureInfo, setPictureInfo] = useState({});
  const [isDeleted, setIsDeleted] = useState(false);

  const [formValue, setFormValue] = useState({
    'description': '',
    'author': '',
    'author_link': '',
    'category': '',
    'category_link': '',
    'subcategory': []
  });

  const params = useParams()
  
  const getPictureInfo = async () => {
    console.log(params.pictureId)
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
    console.log(pictureInfo)
    // const authorUrl = pictureInfo.author;
    // let authorName;
    // await axios
    //   .get(authorUrl, {
    //     headers: {
    //       'Authorization': `${JSON.parse(token)}`,
    //     }
    //   })
    //   .then(response => authorName = response.data.nickname);
    // pictureInfo.author_link = pictureInfo.author;
    // pictureInfo.author = authorName;

    // const categoryUrl = pictureInfo.category;
    // let categoryName;
    // await axios
    //   .get(categoryUrl, {
    //     headers: {
    //       'Authorization': `${JSON.parse(token)}`,
    //     }
    //   })
    //   .then(response => categoryName = response.data.title);
    // pictureInfo.category_link = pictureInfo.category;
    // pictureInfo.category = categoryName;
    // console.log(pictureInfo)
    return setPictureInfo(pictureInfo);
  };
    
  useEffect(() => {
    getPictureInfo();
  }, [])
  
  const postEntry = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/${ pictureInfo.id }/`;
    let token = JSON.parse(localStorage.token);

    const formData = new FormData();
    for (let key in formValue) {
      if (formValue[key]) {
        formData.append(key, formValue[key]);
      }
    }
    // formData.append("description", formValue["description"]);
    // formData.append("author.nickname", formValue["author"]);
    // formData.append("category.title", formValue["category"]);
    // for (let subcat of formValue["subcategory"]) {
    //   formData.append("subcategory", subcat);
    // }
    
    await axios
      .patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`,
        },
      })
      .then(res => console.log(res.data));
    
    return getPictureInfo();
  }

  const updatePicture = async (e) => {
    if (e.target.name.split('_').length > 1) {
      let inputName = e.target.name.split('_');
      let inputIndex = inputName[1];
      inputName = inputName[0];
      let subcategory = pictureInfo.subcategory;
      subcategory.splice(inputIndex, 1);
      console.log(inputIndex)
      setPictureInfo({...pictureInfo, [inputName]: subcategory});
    } else {
      setPictureInfo({...pictureInfo, [e.target.name]: ''});
    }
  }

  const deletePicture = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/pictures/${ pictureInfo.id }/`;
    let token = JSON.parse(localStorage.token);
    
    await axios
      .delete(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${token}`,
        },
      })
    return setIsDeleted(true);
  }

  const subcategoryInput = () => {
    if (pictureInfo.subcategory) {
      let subcategories = []
      pictureInfo.subcategory.forEach((item, i) => {
        subcategories.push(<button className='px-3 py-1 rounded-pill bg-info border-0 text-dark me-2 my-2' key={ i } onClick={ updatePicture } name={'subcategory_' + i }>{ item.title } (x)</button>)
      })
      return (
        <div className='mx-4'>
          { subcategories.length > 0
            ? subcategories
            : <button className='px-3 py-1 rounded-pill bg-info border-0 text-dark me-2 my-2' onClick={ updatePicture } name='subcategory'>{`(+)`}</button>  
          }
        </div>
      )
    } else {
      return
    }
  }

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
              onSubmit={ postEntry }
              className='modal-body'
              tabIndex={-1}
            >
              <FormInput 
                name='description' 
                title='Описание' 
                onChangeValue={ handleFormValueChange } 
              />
              <br />
              <FormInput 
                name='author' 
                title='Автор'
                onChangeValue={ handleFormValueChange } 
              />
              <br />
              <FormInput 
                name='category' 
                title='Категория' 
                onChangeValue={ handleFormValueChange } 
              />
              <br />
              <FormInput 
                name='subcategory' 
                title='Подкатегории' 
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
  }

  const handleFormValueChange = (e) => {
    if (e.target.name == 'subcategory') {
      let newSubcategory = [];
      for (let value of e.target.value.split(" ")) {
        newSubcategory.push(value)
      }
      setFormValue({ ...formValue, [e.target.name]: newSubcategory });
    } else {
      setFormValue({ ...formValue, [e.target.name]: e.target.value });
    }
  }

  return ( 
      <div className="container">
        <div
          // method='patch'
          className='card col-6 mx-auto my-2'
          // onSubmit={ patchPicture }
          >
          <img className='card-img-top' src={ pictureInfo.photo_file } />
          <div className='card-body p-0'>
            <p className='fw-light px-2 bg-dark text-white m-0'>Описание</p>
            <p className='card-text px-4 my-2'>{ pictureInfo.description }</p>
            <p className='fw-light px-2 bg-dark text-white m-0'>Автор</p>
            {pictureInfo.author && pictureInfo.author.nickname
              ? <button className='px-3 py-1 rounded-pill bg-info border-0 text-dark mx-4 my-2' onClick={ updatePicture } name='author'>{ pictureInfo.author.nickname } (x)</button>
              : <button className='px-3 py-1 py-1 rounded-pill bg-info border-0 text-dark mx-4 my-2' onClick={ updatePicture } name='author'>{`(+)`}</button>
            }  
            <p className='fw-light px-2 bg-dark text-white m-0'>Категория</p>
            {pictureInfo.category && pictureInfo.category.title
              ? <button className='px-3 py-1 py-1 rounded-pill bg-info border-0 text-dark mx-4 my-2' onClick={ updatePicture } name='category'>{ pictureInfo.category.title } (x)</button>
              : <button className='px-3 py-1 py-1 rounded-pill bg-info border-0 text-dark mx-4 my-2' onClick={ updatePicture } name='category'>{`(+)`}</button>
            }  
            <p className='fw-light px-2 bg-dark text-white m-0'>Подкатегории</p>
            { subcategoryInput() }
            <div className='d-flex justify-content-between m-2'>
              <button 
                className='btn btn-outline-secondary justify-self-start'
                data-bs-toggle="modal"
                data-bs-target="#editModal"
              >
              Изменить
              </button>
              <button
                className='btn btn-danger justify-self-end'
                onClick={ deletePicture }
              >
              Удалить
              </button>
              { isDeleted &&
                <Navigate to="/albums" replace={true} />
              }
            </div>
          </div>
        </div>
        { editForm() }
      </div>
  );
}

export default PictureElement;

import React, { useEffect, useState } from 'react';
import './Search.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function Search() {
  const [searchResult, setSearchResult] = useState({
    'albums': [],
    'pictures': [],
  });
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  });
  
  const getSearchResult = async (query='') => {
    let token = localStorage.getItem('token');
    let resData;
    
    const albumsUrl = `${API_URL}/albums?search=${ query }&page=${ page }`;
    await axios
      .get(albumsUrl, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data);

    let albumList = resData.results;

    // const picturesUrl = `${API_URL}/pictures?search=${ searchQuery }`;
    // await axios
    //   .get(picturesUrl, {
    //     headers: {
    //       'Authorization': `${JSON.parse(token)}`,
    //     }
    //   })
    //   .then(response => resData = response.data);
    
    // let pictureList = resData.results;

    setButtonActivity({
      previous: !!resData.previous,
      next: !!resData.next,
    })
    return setSearchResult({
      albums: albumList,
      // pictures: pictureList,
    });
  };
    
  useEffect(() => {
    getSearchResult();
  }, [])

  const nextPage = () => {
    setPage(++page);
    return getSearchResult();
  };

  const previousPage = () => {
    setPage(--page);
    return getSearchResult();
  };
  
  const handleSearchChange = (e) => {
    getSearchResult(e.target.value);
  }

  const albumPropsList = Array.from(searchResult.albums).map((album) => {
    return (
      <div className='col' key={album.id}>
        <Link className='card shadow text-decoration-none text-dark' to={ `/albums/${album.id}` }>
          <img className='card-img-top shadow-sm object-fit-cover' src={`${album.cover}`} height='300' alt='Album element' />
          <div className='card-body'>
            <h5 className='card-title border-bottom pb-2'>
              { album.title }
            </h5>
            { album.description
              ? <p className='card-text'>{ album.description }</p>
              : <p className='card-text'>Нет описания</p>
            }
          </div>
        </Link>
      </div>
    )
  });

  // const picturePropsList = Array.from(searchResult.pictures).map((picture) => {
  //   return (
  //     <li key={picture.id}>
  //       <Link to={ `/pictures/${picture.id}` }>
  //         <img width="100" src={`${picture.photo_file}`} alt='Picture element' />
  //         <p>{picture.url}</p>
  //       </Link>
  //     </li>
  //   )
  // });

  return ( 
      <div className="container">
        <div className='mt-2 mb-5'>
          <h1 className='text-center'>Поиск</h1>
          <div className='d-flex justify-content-between my-3'>
            <input className="form-control me-2 shadow-sm" placeholder='Введите запрос..' onChange={ handleSearchChange } />
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
          { albumPropsList.length > 0
            ? <div>
                <div className='row row-cols-3 g-3'>
                  { albumPropsList }
                </div>
              </div>
            : <p className='text-center alert alert-warning'>Ничего не найдено</p>
          }
        </div>
      </div>
  );
}

export default Search;

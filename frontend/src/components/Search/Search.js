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
  let [searchQuery, setSearchQuery] = useState('');
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  });
  
  const getSearchResult = async () => {
    let token = localStorage.getItem('token');
    let resData;
    
    const albumsUrl = `${API_URL}/albums?search=${ searchQuery }`;
    await axios
      .get(albumsUrl, {
        headers: {
          'Authorization': `${JSON.parse(token)}`,
        }
      })
      .then(response => resData = response.data);

    let albumList = resData.results;

    const picturesUrl = `${API_URL}/pictures?search=${ searchQuery }`;
    await axios
      .get(picturesUrl, {
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
    return setSearchResult({
      albums: albumList,
      pictures: pictureList,
    });
  };
    
  // useEffect(() => {
  //   getSearchResult();
  // }, [])

  const nextPage = () => {
    setPage(++page);
    return getSearchResult();
  };

  const previousPage = () => {
    setPage(--page);
    return getSearchResult();
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    getSearchResult();
  }

  const albumPropsList = Array.from(searchResult.albums).map((album) => {
    return (
      <li key={album.id}>
        <Link to={ `/albums/${album.id}` }>
          <img width="100" src={`${album.cover}`} alt='Album element' />
          <p>{album.url}</p>
        </Link>
      </li>
    )
  });

  const picturePropsList = Array.from(searchResult.pictures).map((picture) => {
    return (
      <li key={picture.id}>
        <Link to={ `/pictures/${picture.id}` }>
          <img width="100" src={`${picture.photo_file}`} alt='Picture element' />
          <p>{picture.url}</p>
        </Link>
      </li>
    )
  });

  return ( 
      <div className="album-list">
      <input onChange={ handleSearchChange } />
      <p>Альбомы</p>
      { albumPropsList.length > 0
        ? <div>
            <div>
              <input type='button' disabled={ !buttonActivity.previous } onClick={ previousPage } value='<' />
              <p style={{ display: 'inline' }}>{ page }</p>
              <input type='button' disabled={ !buttonActivity.next } onClick={ nextPage } value='>' />
            </div>
            <ul>{ albumPropsList }</ul>
          </div>
        : <p>Ничего не найдено</p>
      }
      <p>Изображения</p>
      { picturePropsList.length > 0
        ? <div>
            <div>
              <input type='button' disabled={ !buttonActivity.previous } onClick={ previousPage } value='<' />
              <p style={{ display: 'inline' }}>{ page }</p>
              <input type='button' disabled={ !buttonActivity.next } onClick={ nextPage } value='>' />
            </div>
            <ul>{ picturePropsList }</ul>
          </div>
        : <p>Ничего не найдено</p>
      }
      </div>
  );
}

export default Search;

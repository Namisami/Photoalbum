import React, { useEffect, useState } from 'react';
import './AlbumList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function AlbumList() {
  const [albumList, setAlbumList] = useState(0);
  let [page, setPage] = useState(1);
  let [buttonActivity, setButtonActivity] = useState({
    'previous': false,
    'next': false,
  })
  
  const getAlbums = async () => {
    const url = `${API_URL}/albums?page=${ page }`;
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

  const albumPropsList = Array.from({albumList}.albumList).map((album) => {
    console.log(album)
    return (
      <li key={album.id}>
        <Link to={ `${album.id}` }>
          <img width="100" src={`${album.cover}`} alt='Album element' />
          <p>{album.url}</p>
        </Link>
      </li>
    )
  });

  return ( 
      <div className="album-list">
      { albumPropsList.length > 0
        ? <div>
          <p>Список говна ({ albumPropsList.length }) </p>
          <div>
            <input type='button' disabled={ !buttonActivity.previous } onClick={ previousPage } value='<' />
            <p style={{ display: 'inline' }}>{ page }</p>
            <input type='button' disabled={ !buttonActivity.next } onClick={ nextPage } value='>' />
          </div>
          <ul>{ albumPropsList }</ul>
        </div>
        : <p>Нет элементов</p>
      }
        <button onClick={ getAlbums }>Update</button>
      </div>
  );
}

export default AlbumList;

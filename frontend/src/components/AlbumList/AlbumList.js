import React, { useEffect, useState } from 'react';
import './AlbumList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:9000/api/v1';


function AlbumList() {
  const [albumList, setAlbumList] = useState(0);
  
  const getAlbums = async () => {
    const url = `${API_URL}/albums/`;
    let albumList;
    await axios
      .get(url)
      .then(response => albumList = response.data);
    return setAlbumList(albumList);
  };
    
  useEffect(() => {
    getAlbums();
  }, [])

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
        <p>Список говна</p>
        <ul>{ albumPropsList }</ul>
        <button onClick={ getAlbums }>Update</button>
      </div>
  );
}

export default AlbumList;

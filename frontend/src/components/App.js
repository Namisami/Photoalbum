import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:9000/api/v1';

// class App extends React.Component
function App() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     pictureList: [],
  //   };

  //   this.getPictures = this.getPictures.bind(this);
  // }
  const [pictureList, setPictureList] = useState(0);

  const getPictures = async () => {
    const url = `${API_URL}/pictures/`;
    let pictureList;
    await axios.get(url)
      .then(response => pictureList = response.data);
    return setPictureList(pictureList);
  };
    
  useEffect(() => {
    getPictures();
  }, [])
  // componentDidMount = () => {
    
  // };

  // const pictureList = {pictureList};
  console.log({pictureList});
  const picturePropsList = Array.from({pictureList}.pictureList).map((picture) => {
    // for (let propa in picture) {
    //   console.log(propa, picture[propa]);
    // }
    console.log(picture)
    return (
      <li key={picture.id}>
        <img width="100" src={`${picture.photo_file}`} />
        <p>{picture.url}</p>
      </li>
    )
  });

  console.log(picturePropsList)
    // const picturePropsList = () => {
    //   return (
    //     <ul>
    //       <li>
    //         <p>Нет данных</p>
    //       </li>
    //     </ul>
    //   )
    // }

  return ( 
      <div className="App">
        <p>Список говна</p>
        <ul>{ picturePropsList }</ul>
        {/* <p>{this.state.pictureList}</p> */}
        <button onClick={ getPictures }>Update</button>
      </div>
  );
}

export default App;

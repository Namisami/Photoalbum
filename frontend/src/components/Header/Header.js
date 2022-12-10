import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { useEffect, useState } from 'react';
import App from "../App/App";
import PictureList from "../PictureList/PictureList";
import AlbumList from "../AlbumList/AlbumList";
import PictureElement from "../PictureElement/PictureElement";
import Registration from "../Registration/Registration";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import Logout from "../Logout/Logout";
import './Header.css';


function Header() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = () => {
    const user = localStorage.getItem('user')
    console.log(user);
    setUserData(JSON.parse(user));
  };

  const handleAuthorization = (e) => {
    if (localStorage.getItem('user')) {
      return (
        <div>
          <Link to="/profile/">Профиль ({ userData.first_name })</Link>
          <Link to="/logout/">Выйти</Link>
        </div>
      )
    } else {
      return (
        <div>
          <Link to="/signup/">Регистрация</Link>
          <Link to="/login/">Войти</Link>
        </div>
      )
    }
  }

  return (
    <div>
      <ul>
        <li>
          <Link to="/pictures/">Картинки</Link>
        </li>
        <li>
          <Link to="/albums/">Альбомы</Link>
        </li>
        <li>
          { handleAuthorization() }
        </li>
      </ul>
      <Routes>
        <Route path="/pictures/" element={ <App /> } />
        <Route path="/pictures/:pictureId" element={ <PictureElement /> } />
        <Route path="/albums/" element={ <AlbumList /> } />
        <Route path="/albums/:albumId" element={ <PictureList /> } />
        <Route path="/signup/" element={ <Registration /> } />
        <Route path="/login/" element={ <Login onLogin={ authCheck } /> } />
        <Route path="/profile/" element={ <Profile /> } />
        <Route path="/logout/" element={ <Logout onLogout={ authCheck } /> } />
      </Routes>
    </div>
  )
}

export default Header;
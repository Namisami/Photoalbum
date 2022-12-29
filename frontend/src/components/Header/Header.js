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
import Search from "../Search/Search";
import './Header.css';


function Header() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    authCheck();
  }, []);

  const authCheck = () => {
    // const user = localStorage.getItem('user')
    // setUserData(JSON.parse(user));
    if (localStorage.getItem('token')) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  const handleAuthorization = () => {
    if (isLogin) {
      return (
        <div className="col-3 text-end">
          <Link className="btn btn-outline-light mx-3" to="/profile/">Профиль</Link>
          <Link className="btn btn-warning" to="/logout/">Выйти</Link>
        </div>
      )
    } else {
      return (
        <div className="col-3 text-end">
          <Link className="btn btn-outline-light mx-3" to="/signup/">Регистрация</Link>
          <Link className="btn btn-warning" to="/login/">Войти</Link>
        </div>
      )
    }
  }

  return (
    <div className="d-flex flex-column">
      <header className="d-flex px-5 align-items-center justify-content-between text-bg-dark py-3">
        <ul className="nav col-9 justify-self-center">
          <li key={ 1 }>
            <Link className="nav-link text-white" to="/pictures/">Картинки</Link>
          </li>
          <li key={ 2 }>
            <Link className="nav-link text-white" to="/albums/">Альбомы</Link>
          </li>
          <li key={ 3 }>
            <Link className="nav-link text-white" to="/search/">Поиск</Link>
          </li>
        </ul>
        { handleAuthorization() }
      </header>
      <Routes>
        <Route path="/pictures/" element={ <App /> } />
        <Route path="/pictures/:pictureId" element={ <PictureElement /> } />
        <Route path="/albums/" element={ <AlbumList /> } />
        <Route path="/albums/:albumId" element={ <PictureList /> } />
        <Route path="/signup/" element={ <Registration /> } />
        <Route path="/login/" element={ <Login onLogin={ authCheck } /> } />
        <Route path="/profile/" element={ <Profile /> } />
        <Route path="/logout/" element={ <Logout onLogout={ authCheck } /> } />
        <Route path="/search/" element={ <Search /> } />
      </Routes>
    </div>
  )
}

export default Header;

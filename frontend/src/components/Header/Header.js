import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import App from "../App/App";
import PictureList from "../PictureList/PictureList";
import AlbumList from "../AlbumList/AlbumList";
import PictureElement from "../PictureElement/PictureElement";
import './Header.css';


function Header() {
  return (
    <div>
      <Link to="/pictures/">Картинки</Link>
      <Link to="/albums/">Альбомы</Link>
      <Routes>
        <Route path="/pictures/" element={ <App /> } />
        <Route path="/pictures/:pictureId" element={ <PictureElement /> } />
        <Route path="/albums/" element={ <AlbumList /> } />
        <Route path="/albums/:albumId" element={ <PictureList /> } />
      </Routes>
    </div>
  )
}

export default Header;

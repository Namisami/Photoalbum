import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import './index.css';
import React from 'react';
import Header from './components/Header/Header';


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (<div>
//       <Link to="/pictures/">Pictures</Link>
//       <br />
//       <Link to="/albums/">Albums</Link>
//     </div>),
//   },
//   {
//     path: "/pictures/",
//     element: <App />,
//   },
//   {
//     path: "/albums/",
//     element: <AlbumList />,
//   },
//   {
//     path: "/albums/:albumId",
//     element: <App album={ params.albumId } />,
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <Header />
    </Router>
  );


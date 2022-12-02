import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link
} from "react-router-dom";
import './index.css';
import App from './components/App/App';
import React from 'react';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<div>
      <Link to="/pictures/">Pictures</Link>
      <br />
      <Link to="/albums/">Albums</Link>
    </div>),
  },
  {
    path: "/pictures/",
    element: <App />,
  },
  {
    path: "/albums/",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
  );


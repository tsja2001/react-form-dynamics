import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './home.jsx';
import TreeDemo from './tree/Tree.jsx'
import CollapseDemo from './collapse/Collapse.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/tree',
    element: <TreeDemo/>
  },
  {
    path: '/collapse',
    element: <CollapseDemo/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)

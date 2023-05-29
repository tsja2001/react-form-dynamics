import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './home.jsx'
import TreeDemo from './tree/Tree.jsx'
import CollapseDemo from './collapse/Collapse.jsx'
import { Charts } from './charts/Charts.jsx'
import Dnd from './dnd/Dnd.jsx'

import 'react-grid-layout/css/styles.css'
import MyChart from './dnd/myChart/MyChart.jsx'
// import Grid2 from './dnd/grid2/Grid2.jsx'
// import 'react-resizable/css/styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/tree',
    element: <TreeDemo />,
  },
  {
    path: '/collapse',
    element: <CollapseDemo />,
  },
  {
    path: '/charts',
    element: <Charts />,
  },
  {
    path: '/dnd',
    element: <Dnd />,
  },
  {
    path: '/myChart',
    element: <MyChart />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
)

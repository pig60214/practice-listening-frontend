import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { RouterProvider } from 'react-router-dom';
import router from '@/route';
import ReactGA from "react-ga4";

const TRACKING_ID = 'G-DJBYC9Z58V';
ReactGA.initialize(TRACKING_ID);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

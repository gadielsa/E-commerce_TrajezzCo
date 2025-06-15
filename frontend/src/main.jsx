import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import shopContextProvider from './context/shopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <shopContextProvider>
      <App />
    </shopContextProvider>
  </BrowserRouter>,
)

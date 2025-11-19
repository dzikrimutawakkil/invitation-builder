import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// You might need to add a global CSS import here if using Tailwind post-install, 
// but for simplicity with CDN/inline styling, we often keep this file clean.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
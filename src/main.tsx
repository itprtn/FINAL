import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { initializeSecurity, sanitizeEnvironment } from '../lib/security'
import App from './App'

// Initialize security measures
initializeSecurity()
sanitizeEnvironment()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

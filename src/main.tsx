import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { initializeSecurity, sanitizeEnvironment } from '../lib/security'
import App from './App'

// Initialize security measures
initializeSecurity()
sanitizeEnvironment()

// Override CSP for development (temporary solution)
if (process.env.NODE_ENV === 'development') {
  // Programmatically add CSP meta tag
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://wybhtprxiwgzmpmnfceq.supabase.co"
  document.head.appendChild(meta)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

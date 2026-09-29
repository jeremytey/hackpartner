import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureSignupRef } from './lib/signupRef'

// Runs before the router mounts, so the catch-all <Navigate> can't strip the query first
captureSignupRef()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

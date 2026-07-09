import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UnsupportedBrowser from './components/UnsupportedBrowser.jsx'
import { getUnsupportedFeatures } from './utils/browserSupport'

const missing = getUnsupportedFeatures()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {missing.length ? <UnsupportedBrowser missing={missing} /> : <App />}
  </StrictMode>,
)

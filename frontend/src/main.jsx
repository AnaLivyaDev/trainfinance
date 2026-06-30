import { StrictMode } from 'react'
import { Provider } from "./components/ui/provider"
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/home'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <HomePage />

      <Toaster />
    </Provider>
  </StrictMode>,
)

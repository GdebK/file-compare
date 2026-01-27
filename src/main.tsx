import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove StrictMode to stop the Monaco cancellation error
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
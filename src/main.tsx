import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLEOAUTH_CLIENTID}>
      <React.Suspense fallback='Loading'>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path='/*' element={<App />}/>
            </Routes>
          </BrowserRouter>
        </Provider>
      </React.Suspense>
    </GoogleOAuthProvider>
  // </React.StrictMode>,
)

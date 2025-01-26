import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { CustomProvider } from 'rsuite'
import { Loader } from './shared'
import { store } from './redux/store/store'
import reportWebVitals from './reportWebVitals'
import App from './App'
import 'rsuite/dist/rsuite.min.css'
import './scss/app.scss'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <CustomProvider theme="light">
        <Provider store={store}>
          <App />
        </Provider>
      </CustomProvider>
    </Suspense>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

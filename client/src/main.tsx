import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './scss/app.scss'
import store from './store/store.ts'
import { CustomProvider, Loader } from 'rsuite'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <CustomProvider theme='light'>
        <Provider store={store}>
          <App />
        </Provider>
      </CustomProvider>
    </Suspense>
  </StrictMode>,
)

import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import appRouter from './routers/appRouters'
import AuthProvider from './contexts/AuthContext'

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <RouterProvider router={appRouter()} />
      </AuthProvider>
      <ToastContainer containerId='default' aria-label={undefined} />
    </div>
  )
}

export default App

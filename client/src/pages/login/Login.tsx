import { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SelectPicker } from 'rsuite'
import { notifyError } from 'utils'
import { Button, Loader } from '../../shared'
import { AuthContext } from '../../contexts/AuthContext'
import { LOGO, LOGIN } from '../../assets/images'
import GoogleLogo from '../../assets/images/google.svg'
import './login.scss'

const roles = [
  // { label: 'Admin', value: 'admin' },
  { label: 'Student', value: 'student' }
  // { label: 'Recruiter', value: 'recruiter' }
]

function LoginPage() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  if (authContext?.loading) {
    return <Loader />
  }
  if (authContext?.user) {
    return <Navigate to="/" />
  }

  const handleLogin = async () => {
    if (!authContext?.role) {
      notifyError('Please select a role before logging in.')
      return
    }

    try {
      await authContext.login()
      navigate('/')
    } catch (error) {
      notifyError('Login Failed')
    }
  }

  return (
    <div className="login_page">
      <div className="left_side">
        <img src={LOGIN} className="networkLogo__logo" alt="networkLogo" />
      </div>
      <div className="right_side">
        <div className="innner_box">
          <h1>Welcome</h1>
          <span>to</span>

          <img src={LOGO} className="placeme_logo" alt="placeMe Logo" />
          <SelectPicker
            data={roles}
            searchable={false}
            style={{ width: 224, marginBottom: 20 }}
            placeholder="Select Role"
            onChange={(value) => authContext?.setRole(value)}
            value={authContext?.role}
            block
          />
          <Button onClick={handleLogin} appearance="primary">
            Login with
            <img src={GoogleLogo} className="google_logo" alt="google_logo" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

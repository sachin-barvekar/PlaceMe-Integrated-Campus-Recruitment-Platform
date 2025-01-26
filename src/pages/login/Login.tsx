import { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Row, SelectPicker } from 'rsuite'
import { Button, Loader } from '../../shared'
import { AuthContext } from '../../contexts/AuthContext'
import { LOGO, LOGIN } from '../../assets/images'
import GoogleLogo from '../../assets/images/google.svg'
import './login.scss'

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Student', value: 'student' },
  { label: 'Recruiter', value: 'recruiter' }
]

function LoginPage() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<string>('')

  if (authContext?.loading) {
    return <Loader />
  }
  if (authContext?.user) {
    return <Navigate to="/" />
  }

  const handleLogin = async () => {
    if (authContext) {
      try {
        await authContext.login()
        // eslint-disable-next-line
        console.log(authContext)
        navigate('/')
      } catch (error) {
        // eslint-disable-next-line
        console.error('Login failed:', error)
      }
    } else {
      // eslint-disable-next-line
      alert('Please select a role before logging in.')
    }
  }

  return (
    <div className="login_page">
      <Row>
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
              onChange={(value) => setSelectedRole(value ?? '')}
              value={selectedRole}
              block
            />
            <Button
              onClick={handleLogin}
              disabled={!selectedRole}
              appearance="primary"
            >
              Login with
              <img src={GoogleLogo} className="google_logo" alt="google_logo" />
            </Button>
          </div>
        </div>
      </Row>
    </div>
  )
}

export default LoginPage

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import './LoginPage.css'
import logo from '../assets/SaaSAgro.png'
import { FiMail, FiLock } from 'react-icons/fi'

const VALID_CREDENTIALS = [
  { email: 'admin@admin.com', password: 'admin', name: 'Administrador' },
  { email: 'user@user.com', password: 'user123', name: 'Usuário' }
]

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('admin@admin.com')
  const [password, setPassword] = useState('admin')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const validate = () => {
    const errs = {}
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Email inválido'
    if (!password || password.length < 4) errs.password = 'Mínimo de 4 caracteres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setLoading(true)
    
    try {
      // Validar credenciais localmente (sem chamada à API)
      const validCred = VALID_CREDENTIALS.find(c => c.email === email && c.password === password)
      
      if (validCred) {
        login(`token-${Date.now()}`, { id: null, name: validCred.name, email })
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        setSubmitError('Email ou senha incorretos')
      }
    } catch (err) {
      setSubmitError(err.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-hero">
      <div className="waves" aria-hidden>
        <svg viewBox="0 0 1440 480" preserveAspectRatio="none">
          <path className="wave-1" d="M0,220 C220,280 500,360 760,330 C1020,300 1220,210 1440,250 L1440,0 L0,0 Z" />
          <path className="wave-2" d="M0,300 C260,350 540,220 800,250 C1060,280 1240,360 1440,310 L1440,0 L0,0 Z" />
          <path className="wave-3" d="M0,360 C240,410 520,320 780,300 C1040,280 1260,350 1440,300 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="login-center">
        <div className="login-header">
          <img src={logo} alt="SaaSAgro" className="login-logo" />
          <h1 className="login-title">Painel de Integração</h1>
          <div className="login-subtitle">Acesse sua conta para continuar</div>
        </div>
        <div className="w-full">
          <Card className="login-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {submitError ? (
                <div className="alert-error" style={{ borderRadius: 8, padding: 10, fontSize: '0.9rem', margin: 0 }}>
                  {submitError}
                </div>
              ) : null}
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input 
                  label="E-mail Corporativo" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  error={errors.email} 
                  placeholder="admin@admin.com" 
                  iconRight={<FiMail />} 
                />
                <Input 
                  label="Senha" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  error={errors.password} 
                  placeholder="••••••••" 
                  iconRight={<FiLock />} 
                />
                <Button type="submit" loading={loading} className="w-full" style={{ marginTop: 4 }}>
                  Entrar no Sistema
                </Button>
              </form>
              <div className="forgot">Esqueceu sua senha?</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="login-footer">© 2025 SaaSAgro. Todos os direitos reservados.</div>
    </div>
  )
}

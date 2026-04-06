import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../context/LanguageContext'

export default function Login(){
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    try{
      setLoading(true)
      const res = await login(email, password, role)
      if(res.data && res.data.token){
        if(role === 'worker') nav('/worker')
        else nav('/employer')
      }
    }catch(err){
      console.error(err)
      const msg = err.response?.data?.message || err.message || 'Login failed'
      setError(msg)
    }finally{setLoading(false)}
  }

  return (
    <div className="auth-container">
      <Navbar />
      <div className="auth-content">
        <div className="card auth-box animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6">{t('loginHeader')}</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" style={{ background: 'var(--error)', color: 'white', opacity: 0.9 }}>{error}</div>}
          
          <form onSubmit={submit}>
            <div className="input-group">
              <label>{t('accountType')}</label>
              <select value={role} onChange={e=>setRole(e.target.value)} className="select">
                <option value="user">{t('employer')}</option>
                <option value="worker">{t('worker')}</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>{t('email')}</label>
              <input 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="your@email.com"
                required 
                className="input"
              />
            </div>
            
            <div className="input-group mb-6">
              <label>{t('password')}</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                className="input"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading? t('loggingIn') : t('loginButton')}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-secondary">{t('noAccount')} <Link to="/register" className="font-semibold text-primary">{t('registerHere')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

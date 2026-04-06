import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../context/LanguageContext'

export default function Register(){
  const { t } = useLanguage()
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({name:'',email:'',phone:'',password:'',skill:'',location:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const nav = useNavigate()

  const handle = e => setForm({...form, [e.target.name]: e.target.value})

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    try{
      setLoading(true)
      const payload = role === 'worker' ? form : { name: form.name, email: form.email, phone: form.phone, password: form.password }
      const res = await register(payload, role)
      if(res.data && res.data.token){
        if(role === 'worker') nav('/worker')
        else nav('/employer')
      }
    }catch(err){
      console.error(err)
      const msg = err.response?.data?.message || err.message || 'Registration failed'
      setError(msg)
    }finally{setLoading(false)}
  }

  return (
    <div className="auth-container">
      <Navbar />
      <div className="auth-content">
        <div className="card auth-box animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6">{t('registerHeader')}</h1>
          
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
              <label>{t('name')}</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handle} 
                placeholder="John Doe"
                required 
                className="input"
              />
            </div>

            <div className="input-group">
              <label>{t('email')}</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handle} 
                placeholder="your@email.com"
                required 
                className="input"
              />
            </div>

            <div className="input-group">
              <label>{t('phone')}</label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handle} 
                placeholder="9000000000"
                required 
                className="input"
              />
            </div>

            {role === 'worker' && (
              <>
                <div className="input-group">
                  <label>{t('skill')}</label>
                  <input 
                    name="skill" 
                    value={form.skill} 
                    onChange={handle} 
                    placeholder="e.g., Carpentry, Plumbing"
                    required 
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label>{t('location')}</label>
                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handle} 
                    placeholder="Your city/area"
                    required 
                    className="input"
                  />
                </div>
              </>
            )}

            <div className="input-group mb-6">
              <label>{t('password')}</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handle} 
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
              {loading ? t('registering') : t('registerHeader')}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-secondary">{t('noAccount')} <Link to="/login" className="font-semibold text-primary">{t('loginHere')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

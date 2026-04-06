import React, { createContext, useEffect, useState } from 'react'
import api from '../services/api'
import { getToken, setToken, removeToken } from '../utils/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      const token = getToken()
      if(!token){ setLoading(false); return }
      try{
        const res = await api.get('/users/me')
        if(res.data && res.data.user) setUser(res.data.user)
      }catch(e){ console.warn('failed to fetch me', e) }
      finally{ setLoading(false) }
    }
    load()
  },[])

  const login = async (email, password, role='user') => {
    const endpoint = role === 'worker' ? '/workers/login' : '/auth/login'
    const res = await api.post(endpoint, { email, password })
    if(res.data && res.data.token){
      setToken(res.data.token)
      setUser(res.data.user || res.data.worker)
    }
    return res
  }

  const register = async (payload, role='user') => {
    const endpoint = role === 'worker' ? '/workers/register' : '/auth/register'
    const res = await api.post(endpoint, payload)
    if(res.data && res.data.token){
      setToken(res.data.token)
      setUser(res.data.user || res.data.worker)
    }
    return res
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

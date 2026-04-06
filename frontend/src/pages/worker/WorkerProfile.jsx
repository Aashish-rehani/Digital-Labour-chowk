import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export default function WorkerProfile(){
  const { t } = useLanguage()
  const { user } = useContext(AuthContext)
  const nav = useNavigate()
  
  const [form, setForm] = useState({ name: '', skill: '', location: '', experience: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!user) {
      nav('/login')
      return
    }

    async function fetchProfile() {
      try {
        const res = await api.get(`/workers/${user.id}`)
        if (res.data && res.data.worker) {
          const w = res.data.worker
          setForm({
            name: w.name || '',
            skill: w.skill || '',
            location: w.location || '',
            experience: w.experience || ''
          })
        }
      } catch (err) {
        console.error(err)
        setMessage({ type: 'error', text: 'Failed to load profile details.' })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [user, nav])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    try {
      setSaving(true)
      await api.put(`/workers/${user.id}`, form)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('workerProfileTitle') || 'Edit Profile'}</h1>
        
        <div className="card mx-auto animate-fade-in" style={{ maxWidth: 600 }}>
          {message.text && (
            <div className={`mb-6 p-4 rounded-md font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                 style={{ background: message.type === 'error' ? 'var(--error)' : 'var(--success)', color: 'white', opacity: 0.9 }}>
              {message.text}
            </div>
          )}

          {loading ? (
            <p className="text-secondary text-center">{t('loading') || 'Loading...'}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-4">
                <label className="text-secondary">Full Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="input"
                />
              </div>

              <div className="input-group mb-4">
                <label className="text-secondary">Primary Skill</label>
                <input 
                  name="skill" 
                  value={form.skill} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Carpentry, Plumbing"
                  className="input"
                />
              </div>

              <div className="input-group mb-4">
                <label className="text-secondary">Location</label>
                <input 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  required 
                  className="input"
                />
              </div>

              <div className="input-group mb-8">
                <label className="text-secondary">Years of Experience</label>
                <input 
                  name="experience" 
                  type="number"
                  value={form.experience} 
                  onChange={handleChange} 
                  className="input"
                  min="0"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="btn btn-primary flex-1"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => nav('/worker')}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

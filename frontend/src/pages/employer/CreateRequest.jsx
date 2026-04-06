import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import { authHeader } from '../../utils/auth'
import { useLanguage } from '../../context/LanguageContext'
import MapPicker from '../../components/MapPicker'

export default function CreateRequest(){
  const { t } = useLanguage()
  const [form, setForm] = useState({title:'',description:'',location:'',skill:'',wage:'', latitude: '', longitude: ''})
  const [saving, setSaving] = useState(false)
  const handleChange = e => setForm({...form,[e.target.name]: e.target.value})

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          alert("GPS Location captured successfully!");
        },
        (error) => alert("Error getting location. Please allow location access.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  const submit = async (e)=>{
    e.preventDefault()
    try{
      setSaving(true)
      await api.post('/employers/requests', form, { headers: authHeader() })
      alert('Request created')
      setForm({title:'',description:'',location:'',skill:'',wage:'', latitude: '', longitude: ''})
    }catch(err){console.error(err); alert('Error creating request')}
    finally{setSaving(false)}
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('createNewJob')}</h1>
        <div className="card mx-auto" style={{ maxWidth: 600 }}>
          <form onSubmit={submit}>
            <div className="input-group">
              <label>Title</label>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="input" />
            </div>
            <div className="input-group">
               <label>Description</label>
               <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="textarea" />
            </div>
            <div className="input-group">
               <label>Location (Physical Address)</label>
               <div className="flex gap-2">
                 <input name="location" placeholder="e.g., Delhi Central" value={form.location} onChange={handleChange} required className="input" />
                 <button type="button" onClick={handleGetLocation} className="btn btn-secondary" title="Use Current GPS">📍 Locate Me</button>
               </div>
            </div>
            
            <div className="input-group mb-6">
               <label>Pin Location on Map</label>
               <MapPicker 
                 latitude={form.latitude} 
                 longitude={form.longitude} 
                 onChange={(lat, lng) => setForm(prev => ({...prev, latitude: lat, longitude: lng}))}
               />
               {(form.latitude && form.longitude) ? 
                 <small className="text-success mt-1 block">✓ Coordinates captured: {Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)}</small>
                 : <small className="text-secondary mt-1 block">Click on the map to drop a pin, or use the Locate Me button.</small>
               }
            </div>
            <div className="input-group">
               <label>Skill</label>
               <input name="skill" placeholder="Skill" value={form.skill} onChange={handleChange} required className="input" />
            </div>
            <div className="input-group mb-6">
               <label>Wage</label>
               <input name="wage" placeholder="Wage" value={form.wage} onChange={handleChange} required type="number" className="input" />
            </div>
            <div>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
                  {saving ? 'Saving...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

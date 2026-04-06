import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import RequestCard from '../../components/RequestCard'
import { useLanguage } from '../../context/LanguageContext'
import MapPicker from '../../components/MapPicker'

export default function EmployerDasboard() {
  const { user } = useContext(AuthContext)
  const { t } = useLanguage()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', location: '', skill: '', wage: '', latitude: '', longitude: '' })
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!user) nav('/login')
  }, [user, nav])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/employers/requests')
        setRequests(res.data.jobRequests || res.data)
      } catch (e) {
        console.error(e)
      } finally { setLoading(false) }
    }
    if (user?.id) load()
  }, [user?.id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const res = await api.post('/employers/requests', form)
      setRequests([...requests, res.data.jobRequest])
      setForm({ title: '', description: '', location: '', skill: '', wage: '', latitude: '', longitude: '' })
      setShowForm(false)
      alert('Job request created successfully!')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to create job')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-3xl font-bold">{t('myRequests')}</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? t('cancel') : t('newJobRequest')}
            </button>
          </div>

          {/* Create Job Form */}
          {showForm && (
            <div className="card animate-fade-in mb-8">
              <h2 className="text-xl font-bold mb-6">{t('createNewJob')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 grid-mobile-stack gap-4 mb-4">
                  <div className="input-group">
                    <label>{t('jobTitle')}</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Paint Wall"
                      required
                      className="input"
                    />
                  </div>
                  <div className="input-group">
                    <label>{t('wage')}</label>
                    <input
                      name="wage"
                      type="number"
                      value={form.wage}
                      onChange={handleChange}
                      placeholder="500"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="input-group mb-4">
                  <label>{t('description')}</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the job..."
                    required
                    className="textarea"
                  />
                </div>

                <div className="grid md:grid-cols-2 grid-mobile-stack gap-4 mb-6">
                  <div className="input-group">
                    <label>{t('skillRequired')}</label>
                    <input
                      name="skill"
                      value={form.skill}
                      onChange={handleChange}
                      placeholder="e.g., Carpentry"
                      required
                      className="input"
                    />
                  </div>
                  <div className="input-group">
                    <label>{t('locationLabel')} (Physical Address)</label>
                    <div className="flex gap-2">
                       <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Your city/area"
                        required
                        className="input"
                      />
                      <button type="button" onClick={handleGetLocation} className="btn btn-secondary" title="Use Current GPS">📍 Locate Me</button>
                    </div>
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-success"
                  style={{ width: '100%' }}
                >
                  {submitting ? t('creating') : t('createJobRequest')}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Job Requests List */}
        <div>
          {loading && <p className="text-center font-medium mt-8">{t('loading')}</p>}
          {!loading && requests.length === 0 && <p className="text-secondary text-center mt-8">{t('noJobRequests')}</p>}
          <div className="grid grid-cols-1">
            {requests.map(req => (
              <RequestCard key={req._id} request={req} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

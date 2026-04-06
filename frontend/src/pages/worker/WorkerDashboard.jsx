import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import RequestCard from '../../components/RequestCard'
import { useLanguage } from '../../context/LanguageContext'

export default function WorkerDashboard() {
  const { t } = useLanguage()
  const { user } = useContext(AuthContext)
  const [worker, setWorker] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [availability, setAvailability] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!user) nav('/login')
  }, [user, nav])

  useEffect(() => {
    async function loadJobs(lat, lng) {
      try {
        let url = '/employers/requests/all/open';
        if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
        
        const jobsRes = await api.get(url);
        setJobs(jobsRes.data.jobRequests || jobsRes.data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }

    async function initialize() {
      try {
        const workerRes = await api.get(`/workers/${user?.id}`);
        setWorker(workerRes.data.worker);
        setAvailability(workerRes.data.worker.availability);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => loadJobs(pos.coords.latitude, pos.coords.longitude),
            (err) => loadJobs(null, null)
          );
        } else {
          loadJobs(null, null);
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    
    if (user?.id) initialize();
  }, [user?.id]);

  const handleAvailability = async (newStatus) => {
    try {
      await api.put(`/workers/${user.id}/availability`, { availability: newStatus })
      setAvailability(newStatus)
      setWorker({ ...worker, availability: newStatus })
    } catch (e) {
      console.error(e)
      alert(t('failedUpdateAvailability'))
    }
  }

  const handleClaim = async (jobId) => {
    try {
      await api.put(`/workers/claims/${jobId}`)
      setJobs(jobs.filter(j => j._id !== jobId))
      alert(t('claimSuccess'))
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || t('failedClaim'))
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <div className="grid md:grid-sidebar grid-mobile-stack gap-8">
          
          {/* Profile Sidebar */}
          <div className="card h-fit sticky-sidebar animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">{t('yourProfile')}</h2>
            {worker ? (
              <div>
                <div className="mb-4 bg-tertiary p-4 rounded-md" style={{ background: 'var(--bg-tertiary)', padding: 'var(--spacing-4)', borderRadius: 'var(--border-radius-md)' }}>
                  <div className="flex gap-4 items-center">
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {worker.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-0">{worker.name}</h3>
                      <p className="text-sm text-secondary">{worker.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs uppercase font-bold tracking-wider text-tertiary mb-1">{t('skillLabel')}</p>
                  <p className="font-semibold" style={{ color: 'var(--brand-primary)' }}>{worker.skill}</p>
                </div>
                <div className="mb-6">
                  <p className="text-xs uppercase font-bold tracking-wider text-tertiary mb-1">{t('locationLabelCaps')}</p>
                  <p className="font-semibold text-primary">{worker.location}</p>
                </div>

                <div className="mb-6 pt-6 border-t" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <p className="text-xs uppercase font-bold tracking-wider text-tertiary mb-3">{t('availabilityLabel')}</p>
                  <button 
                    onClick={() => handleAvailability(!availability)} 
                    className={`btn ${availability ? 'btn-success' : 'btn-danger'}`}
                    style={{ width: '100%' }}
                  >
                    {availability ? t('available') : t('notAvailable')}
                  </button>
                </div>
              </div>
            ) : <p className="text-secondary text-center">{t('loading')}</p>}
            <Link to="/worker/profile" className="btn btn-secondary mt-4 block text-center" style={{ width: '100%' }}>{t('editProfile')}</Link>
          </div>

          {/* Jobs List */}
          <div>
            <h1 className="text-3xl font-bold mb-6">{t('availableJobs')}</h1>
            {loading && <p className="text-secondary text-center mt-8">{t('loading')}</p>}
            {!loading && jobs.length === 0 && <p className="text-secondary text-center mt-8">{t('noOpenJobs')}</p>}
            <div className="grid grid-cols-1">
              {jobs.map(job => (
                <RequestCard 
                  key={job._id} 
                  request={job} 
                  showActions={(
                    <button 
                      onClick={() => handleClaim(job._id)} 
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      {t('claimJob')}
                    </button>
                  )}
                />
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import RequestCard from '../../components/RequestCard'
import { useLanguage } from '../../context/LanguageContext'

export default function WorkerJobs(){
  const { t } = useLanguage()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(lat, lng) {
      try {
        let url = '/employers/requests/all/open';
        if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
        
        const res = await api.get(url);
        setJobs(res.data.jobRequests || res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        (err) => load(null, null)
      );
    } else {
      load(null, null);
    }
  }, []);

  const handleClaim = async (jobId) => {
    try{
      await api.put(`/workers/claims/${jobId}`)
      setJobs(ws => ws.filter(j => j._id !== jobId))
      alert(t('claimSuccess'))
    }catch(err){
      console.error(err)
      alert(err.response?.data?.message || t('failedClaim'))
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('availableJobs')}</h1>
        {loading && <p className="text-secondary text-center mt-8">{t('loading')}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(j=> (
            <RequestCard key={j._id} request={j} showActions={(
              <button onClick={()=>handleClaim(j._id)} className="btn btn-primary" style={{ width: '100%' }}>{t('claimJob')}</button>
            )} />
          ))}
        </div>
      </main>
    </div>
  )
}

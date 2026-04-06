import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../context/LanguageContext'

export default function WorkerApproval(){
  const { t } = useLanguage()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/admin/workers/pending')
        setWorkers(res.data.workers || res.data)
      }catch(e){
        console.error(e)
      }finally{setLoading(false)}
    }
    load()
  },[])

  const handleApprove = async (id)=>{
    try{
      await api.put(`/admin/workers/${id}/approve`)
      setWorkers(ws=>ws.filter(w=>w._id!==id))
    }catch(e){console.error(e)}
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('pendingApprovals')}</h1>
        {loading && <p className="text-secondary text-center mt-8">{t('loading')}</p>}
        {!loading && workers.length===0 && <p className="text-secondary text-center">{t('noPendingWorkers')}</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-mobile-stack gap-4">
          {workers.map(w=> (
            <div key={w._id} className="card animate-fade-in flex flex-col justify-between" style={{ gap: 'var(--spacing-4)' }}>
              <div>
                 <strong className="text-lg text-primary block mb-1">{w.name || w.email}</strong>
                 <span className="text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>{w.skill || '—'}</span>
              </div>
              <button 
                 onClick={()=>handleApprove(w._id)} 
                 className="btn btn-success"
                 style={{ width: '100%' }}
               >
                 {t('approve')}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

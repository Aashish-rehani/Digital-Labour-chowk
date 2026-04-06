import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import RequestCard from '../../components/RequestCard'
import { authHeader } from '../../utils/auth'
import { useLanguage } from '../../context/LanguageContext'

export default function MyRequests(){
  const { t } = useLanguage()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/employers/requests', { headers: authHeader() })
        setRequests(res.data.jobRequests || [])
      }catch(e){console.error(e)}
      finally{setLoading(false)}
    }
    load()
  },[])

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('myRequests')}</h1>
        {loading && <p className="text-secondary text-center mt-8">{t('loading')}</p>}
        <div className="grid grid-cols-1">
            {requests.map(r=> <RequestCard key={r._id} request={r} />)}
        </div>
      </main>
    </div>
  )
}

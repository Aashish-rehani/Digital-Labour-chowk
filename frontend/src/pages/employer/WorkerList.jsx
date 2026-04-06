import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { fetchWorkers } from '../../services/workerService'
import WorkerCard from '../../components/WorkerCard'
import { useLanguage } from '../../context/LanguageContext'

export default function WorkerList() {
  const { t } = useLanguage()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWorkers()
        setWorkers(res.data.workers || res.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('availableWorkers')}</h1>
        {loading && <p className="text-secondary text-center mt-8">{t('loading')}</p>}
        {!loading && workers.length === 0 && <p className="text-secondary text-center">No available workers at the moment.</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-mobile-stack gap-4">
          {workers.map(w => <WorkerCard key={w._id} worker={w} />)}
        </div>
      </main>
    </div>
  )
}

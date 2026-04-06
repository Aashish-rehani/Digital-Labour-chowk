import React from 'react'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminDashboard(){
  const { t } = useLanguage()
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-8 pb-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('adminDashboard')}</h1>
        <div className="card">
           <p className="text-secondary">{t('adminHelp')}</p>
        </div>
      </main>
    </div>
  )
}

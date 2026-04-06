import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useLanguage } from '../../context/LanguageContext'

export default function Home(){
  const { t } = useLanguage()

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex items-center justify-center animate-fade-in" style={{
        minHeight: '75vh',
        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
        color: '#fff',
        textAlign: 'center',
        padding: 'var(--spacing-8) var(--spacing-4)'
      }}>
        <div style={{ maxWidth: '900px', width: '100%' }}>
          <h1 className="text-4xl font-bold mb-4" style={{ lineHeight: 1.2, color: '#fff' }}>
            {t('homeTitle')}
          </h1>
          <p className="text-xl mb-8" style={{ opacity: 0.95, color: '#fff' }}>
            {t('homeSubtitle')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--brand-primary)' }}>
              {t('getStarted')}
            </Link>
            <Link to="/worker/jobs" className="btn" style={{ 
              background: 'rgba(255,255,255,0.15)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.3)' 
            }}>
              {t('browseJobs')}
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container" style={{ padding: 'var(--spacing-12) var(--spacing-4)' }}>
        <h2 className="text-3xl font-bold text-center mb-8">{t('howItWorks')}</h2>
        
        <div className="grid md:grid-cols-3 grid-mobile-stack">
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📝</div>
            <h3 className="text-xl font-semibold mb-2">{t('postJob')}</h3>
            <p className="text-secondary">{t('postJobDescription')}</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>👷</div>
            <h3 className="text-xl font-semibold mb-2">{t('workersApply')}</h3>
            <p className="text-secondary">{t('workersApplyDescription')}</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>💳</div>
            <h3 className="text-xl font-semibold mb-2">{t('managePay')}</h3>
            <p className="text-secondary">{t('managePayDescription')}</p>
          </div>
        </div>
      </section>

    </div>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="navbar-header" style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: 'var(--spacing-3) var(--spacing-4)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'var(--brand-primary)' }}>{t('appName')}</Link>
      </h2>
      
      {/* Desktop Navigation */}
      <nav className="nav-desktop-links nav-links">
        <Link to="/employer" className="font-medium text-primary">{t('employer')}</Link>
        <Link to="/worker" className="font-medium text-primary">{t('worker')}</Link>
        <Link to="/login" className="font-medium text-primary">{t('login')}</Link>
        <Link to="/register" className="btn btn-primary">{t('register')}</Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px', borderRadius: '50%', border: 'none', background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Toggle Theme"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
        <button
          onClick={toggleLanguage}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '14px' }}
        >
           {language === 'en' ? 'हिंदी' : 'EN'}
        </button>
        
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle Navigation">
          <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/employer" onClick={closeMenu} className="font-medium text-primary">{t('employer')}</Link>
        <Link to="/worker" onClick={closeMenu} className="font-medium text-primary">{t('worker')}</Link>
        <Link to="/login" onClick={closeMenu} className="font-medium text-primary">{t('login')}</Link>
        <Link to="/register" onClick={closeMenu} className="font-bold text-primary">{t('register')}</Link>
      </nav>
    </header>
  )
}

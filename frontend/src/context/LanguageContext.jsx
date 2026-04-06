import React, { createContext, useContext, useState, useMemo } from 'react'
import { translations } from '../utils/i18n'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'en')

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en'
    setLanguage(next)
    localStorage.setItem('appLanguage', next)
  }

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

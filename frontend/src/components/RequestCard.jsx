import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import MapViewer from './MapViewer'

export default function RequestCard({ request, showActions }) {
  const { language } = useLanguage()
  const [showMap, setShowMap] = useState(false)
  if (!request) return null

  const displayTitle = request.translations?.[language]?.title || request.title || 'Untitled Request'
  const displayDescription = request.translations?.[language]?.description || request.description || 'No description'

  return (
    <div className="card animate-fade-in" style={{ marginBottom: 'var(--spacing-4)' }}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-primary mb-0">{displayTitle}</h3>
        {request.status && (
          <span className={`badge ${request.status === 'open' ? 'badge-success' : 'badge-warning'}`}>
            {request.status === 'open' ? 'Open' : 'Assigned'}
          </span>
        )}
      </div>
      
      <p className="text-secondary mb-6">{displayDescription}</p>
      
      <div className="grid md:grid-cols-3 grid-mobile-stack gap-4 mb-4">
        <div>
          <span className="text-sm text-tertiary uppercase font-bold tracking-wider">LOCATION</span>
          <p className="font-semibold text-primary mt-1">
             {request.location || 'N/A'}
             {request.distance !== undefined && (
               <span className="block text-sm mt-1" style={{color: 'var(--brand-secondary)'}}>
                 📍 {request.distance.toFixed(1)} km away
               </span>
             )}
          </p>
        </div>
        <div>
          <span className="text-sm text-tertiary uppercase font-bold tracking-wider">SKILL</span>
          <p className="font-semibold text-primary mt-1" style={{ color: 'var(--brand-primary)' }}>{request.skill || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-tertiary uppercase font-bold tracking-wider">WAGE</span>
          <p className="font-semibold text-primary mt-1">₹{request.wage || '—'}</p>
        </div>
      </div>

      {request.geometry && request.geometry.coordinates && request.geometry.coordinates.length === 2 && request.geometry.coordinates[0] !== 0 && (
        <div className="mb-4">
          <button onClick={() => setShowMap(!showMap)} className="text-sm font-semibold" style={{ color: 'var(--brand-secondary)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            {showMap ? 'Hide Map' : 'View Job on Map 🗺️'}
          </button>
          
          {showMap && (
            <MapViewer 
               longitude={request.geometry.coordinates[0]} 
               latitude={request.geometry.coordinates[1]} 
            />
          )}
        </div>
      )}

      {request.assignedWorkerId && (
        <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--spacing-4)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', marginTop: 'var(--spacing-4)' }}>
          <p className="text-sm font-bold uppercase tracking-wider mb-2 text-primary">ASSIGNED TO</p>
          <div className="grid md:grid-cols-3 grid-mobile-stack gap-4">
            <div>
              <span className="text-sm text-secondary">Name</span>
              <p className="font-semibold text-primary">{request.assignedWorkerId.name || request.assignedWorkerId.email}</p>
            </div>
            {request.assignedWorkerId.skill && (
              <div>
                <span className="text-sm text-secondary">Skill</span>
                <p className="font-semibold text-primary">{request.assignedWorkerId.skill}</p>
              </div>
            )}
            {request.assignedWorkerId.location && (
              <div>
                <span className="text-sm text-secondary">Location</span>
                <p className="font-semibold text-primary">{request.assignedWorkerId.location}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showActions && request.status === 'open' && (
        <div className="mt-6 border-t pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          {showActions}
        </div>
      )}
    </div>
  )
}

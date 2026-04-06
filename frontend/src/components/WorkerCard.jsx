import React from 'react'

export default function WorkerCard({ worker }) {
  if(!worker) return null;
  
  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <div className="flex items-center gap-4">
        <div style={{ 
          width: '50px', height: '50px', borderRadius: '50%', 
          background: 'var(--brand-primary)', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '1.25rem', fontWeight: 'bold' 
        }}>
          {worker?.name?.charAt(0)?.toUpperCase() || 'W'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary mb-0">{worker?.name || 'Worker Name'}</h3>
          <p className="text-sm text-secondary">{worker?.email}</p>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <span className="text-xs text-tertiary uppercase font-bold tracking-wider">Skill</span>
          <p className="font-semibold text-primary" style={{ color: 'var(--brand-primary)' }}>{worker?.skill || 'N/A'}</p>
        </div>
        <div>
          <span className="text-xs text-tertiary uppercase font-bold tracking-wider">Location</span>
          <p className="font-semibold text-primary">{worker?.location || 'N/A'}</p>
        </div>
      </div>
      
      <div className="mt-2">
        <span className={`badge ${worker?.availability ? 'badge-success' : 'badge-warning'}`}>
          {worker?.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
  )
}

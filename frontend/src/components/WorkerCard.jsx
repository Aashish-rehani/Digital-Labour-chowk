import React from 'react'

export default function WorkerCard({worker}){
  return (
    <div className="worker-card">
      <h3>{worker?.name || 'Worker Name'}</h3>
    </div>
  )
}

import React from 'react'

export default function Loader(){
	return (
		<div style={{display:'flex',justifyContent:'center',padding:20}}>
			<div className="loader" style={{width:32,height:32,borderRadius:16,border:'4px solid #ccc',borderTopColor:'#333',animation:'spin 1s linear infinite'}} />
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
		</div>
	)
}

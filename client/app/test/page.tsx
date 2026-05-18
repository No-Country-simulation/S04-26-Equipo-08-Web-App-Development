import React from 'react'
import ServerOnline from '../components/clients/server'
import Header from '../components/layout/headers/header'
import CheckAdminComponent from '../components/clients/checkAdmin'

export default function page() {
  return (
    <div>
      <Header />
      <div className='grid-cols-4 gap m-4 p-4'>
      <ServerOnline />
      < CheckAdminComponent />
    </div>
    </div>
  )
}

import React from 'react'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import StatsGrid from '../components/admin/StatsGrid'
import ContractorsTable from '../components/admin/ContractorsTable'

export default function AdminPage() {
  return (
    <div>
      <div className="flex min-h-screen bg-[#e8eaf0]">
        <AdminSidebar />
        <main className="flex flex-1 flex-col">
          <AdminHeader />
          <section className="flex-1 space-y-8 p-8">
            <div>
            </div>
            <StatsGrid />
            <ContractorsTable />
          </section>
        </main>
      </div>
    </div>
  )
}

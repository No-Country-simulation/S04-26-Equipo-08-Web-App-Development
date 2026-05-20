import React from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import InviteContractorForm from '../../components/admin/InviteContractorForm'

export default function AddContractorPage() {
  return (
    <div>
      <div className="flex min-h-screen bg-[#e8eaf0]">
        <AdminSidebar />
        <main className="flex flex-1 flex-col">
          <AdminHeader title="Agregar Contratista" />
          <section className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--on-surface)]">
                Invitar a la Plataforma
              </h1>
              <p className="mt-2 text-[var(--on-surface-variant)]">
                Gestiona y envía invitaciones a nuevos contratistas.
              </p>
            </div>
            
            <InviteContractorForm />
          </section>
        </main>
      </div>
    </div>
  )
}

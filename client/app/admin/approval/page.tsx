import ActivosTable from '@/app/components/admin/ActivosTable'
import AdminHeader from '@/app/components/admin/AdminHeader'
import AdminSidebar from '@/app/components/admin/AdminSidebar'

export default function page() {
    return (
        <div>
            <div className="flex min-h-screen bg-[#e8eaf0]">
                <AdminSidebar />
                <main className="flex flex-1 flex-col">
                    <AdminHeader />
                    <section className="flex-1 space-y-8 p-8">
                        <div>
                        </div>
                        <ActivosTable />
                    </section>
                </main>
            </div>
        </div>
    )
}

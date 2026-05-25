import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#e8eaf0]">
      <AdminSidebar />
      <main className="flex flex-1 flex-col">
        <AdminHeader />
        <section className="flex-1 space-y-8 p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

import InviteContractorForm from "@/app/components/admin/InviteContractorForm";

export default function AddContractorPage() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[var(--on-surface)]">
        Invitar a la Plataforma
      </h1>
      <p className="mt-2 text-[var(--on-surface-variant)]">
        Gestiona y envía invitaciones a nuevos contratistas.
      </p>
      <div className="mt-8">
        <InviteContractorForm />
      </div>
    </div>
  );
}

import { contractors } from "@/data/admin-data";
import { notFound } from "next/navigation";
import ContractorDetailClient from "@/app/components/admin/ContractorDetailClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractorDetailPage({ params }: Props) {
  const { id } = await params;
  const contractor = contractors.find((c) => c.id === id);

  if (!contractor) {
    notFound();
  }

  return <ContractorDetailClient contractor={contractor} />;
}

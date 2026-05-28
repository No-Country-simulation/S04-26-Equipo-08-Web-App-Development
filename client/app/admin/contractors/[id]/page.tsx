import ContractorDetailClient from "@/app/components/admin/ContractorDetailClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractorDetailPage({ params }: Props) {
  const { id } = await params;

  return <ContractorDetailClient id={id} />;
}

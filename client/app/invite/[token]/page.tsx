import InvitationCard from "@/app/components/invitation/invitationCard";
import Header from "@/app/components/layout/headers/header";

interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default async function InvitePage({
  params,
}: Props) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <InvitationCard token={token} />
        </div>
      </section>
    </main>
  );
}
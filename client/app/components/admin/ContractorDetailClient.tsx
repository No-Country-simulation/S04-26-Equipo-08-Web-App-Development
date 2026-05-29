"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useContractorDetail, useReviewStep } from "@/hooks/queries/useContractorDetail";
import type {
  ContractorStep,
  PersonalInfoData,
  DocumentData,
  ContractData,
  PaymentData,
  IdentityData,
  ContractorDetail,
} from "@/types/admin";
import { useAppToast } from "@/app/providers/ToastProvider";

interface Props {
  id: string;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  id_card: "Cédula",
  passport: "Pasaporte",
  tax_form: "Formulario fiscal",
  address_proof: "Comprobante de domicilio",
  certificate: "Certificado",
  diploma: "Título",
  professional_license: "Licencia profesional",
  others: "Otros",
};

function PersonalInfoPreview({ data }: { data: PersonalInfoData }) {
  const fields = [
    { label: "Nombre", value: `${data.firstname} ${data.lastname}` },
    { label: "Correo", value: data.email },
    { label: "Teléfono", value: data.phone },
    { label: "Fecha de nacimiento", value: data.birthDate },
    { label: "País", value: data.country },
    { label: "Ciudad", value: data.city },
    { label: "Dirección", value: data.address },
    { label: "Tipo de documento", value: data.documentType === "passport" ? "Pasaporte" : "Cédula" },
    { label: "Número de documento", value: data.documentNumber },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {fields.map((f) => (
        <div key={f.label}>
          <p className="text-xs text-slate-400 uppercase">{f.label}</p>
          <p className="font-medium text-slate-700">{f.value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

function DocumentPreview({ data }: { data: DocumentData }) {
  if (!data.files || data.files.length === 0) {
    return <p className="text-sm text-slate-400 italic">No hay documentos subidos.</p>;
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Aprobado</span>;
      case "rejected": return <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Rechazado</span>;
      default: return <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Pendiente</span>;
    }
  };

  return (
    <div className="space-y-2">
      {data.files.map((f, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={18} className="text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{f.name}</p>
              <p className="text-xs text-slate-400">{DOC_TYPE_LABELS[f.type] || f.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {statusBadge(f.status)}
            {f.url && (
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <ExternalLink size={14} />
                Ver
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContractPreview({ data }: { data: ContractData }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase">Estado</p>
          <p className={`font-medium ${data.signed ? "text-green-600" : "text-slate-500"}`}>
            {data.signed ? "Firmado" : "Pendiente de firma"}
          </p>
        </div>
        {data.signedAt && (
          <div>
            <p className="text-xs text-slate-400 uppercase">Fecha de firma</p>
            <p className="font-medium text-slate-700">
              {new Date(data.signedAt).toLocaleDateString("es-ES", { dateStyle: "long" })}
            </p>
          </div>
        )}
      </div>
      {data.contractUrl && (
        <a
          href={data.contractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <FileText size={18} className="text-primary" />
          <span className="text-sm text-slate-600 flex-1">Ver contrato</span>
          <ExternalLink size={14} className="text-slate-400" />
        </a>
      )}
      {!data.signed && !data.contractUrl && (
        <p className="text-sm text-slate-400 italic">El contratista aún no ha iniciado la firma.</p>
      )}
    </div>
  );
}

function PaymentPreview({ data }: { data: PaymentData }) {
  const methodLabels: Record<string, string> = {
    bank_transfer: "Transferencia bancaria",
    crypto: "Criptomonedas",
    cash: "Efectivo",
  };
  if (!data.methodType) {
    return <p className="text-sm text-slate-400 italic">El contratista aún no ha configurado método de pago.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-xs text-slate-400 uppercase">Método</p>
        <p className="font-medium text-slate-700">{methodLabels[data.methodType] || data.methodType}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Titular</p>
        <p className="font-medium text-slate-700">{data.accountHolder || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Cuenta</p>
        <p className="font-medium text-slate-700">{data.accountNumber || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Banco</p>
        <p className="font-medium text-slate-700">{data.bankName || "—"}</p>
      </div>
    </div>
  );
}

function IdentityPreview({ data }: { data: IdentityData }) {
  if (!data.status) {
    return <p className="text-sm text-slate-400 italic">El contratista aún no ha completado verificación.</p>;
  }
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase">Estado</p>
          <p className={`font-medium ${
            data.status === "verified" ? "text-green-600" : data.status === "failed" ? "text-red-600" : "text-slate-500"
          }`}>
            {data.status === "verified" ? "Verificado" : data.status === "failed" ? "Falló" : "Pendiente"}
          </p>
        </div>
        {data.verifiedAt && (
          <div>
            <p className="text-xs text-slate-400 uppercase">Verificado el</p>
            <p className="font-medium text-slate-700">
              {new Date(data.verifiedAt).toLocaleDateString("es-ES", { dateStyle: "long" })}
            </p>
          </div>
        )}
      </div>
      {data.notes && (
        <div className="rounded-lg bg-white p-3 shadow-sm">
          <p className="text-xs text-slate-400 uppercase">Notas</p>
          <p className="text-sm text-slate-600 mt-1">{data.notes}</p>
        </div>
      )}
    </div>
  );
}

export default function ContractorDetailClient({ id }: Props) {
  const { data: detail, isLoading, error } = useContractorDetail(id);
  const reviewMutation = useReviewStep(id);
  const { showToast } = useAppToast();
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [reviewingStep, setReviewingStep] = useState<string | null>(null);

  const resolvedSteps = useMemo<ContractorStep[] | null>(() => {
    if (!detail) return null;

    const statusMap: Record<string, string> = {};
    if (detail.steps) {
      for (const s of detail.steps) {
        statusMap[s.step_name] = s.completed ? "completed" : "pending";
      }
    }

    const user = detail.user;
    const profile = detail.profile;
    const name = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email;

    const personalInfo: PersonalInfoData = {
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      email: user.email,
      phone: user.phone ?? "",
      birthDate: profile?.birth_date
        ? new Date(profile.birth_date).toLocaleDateString("es-ES")
        : "",
      country: profile?.country ?? "",
      city: profile?.city ?? "",
      address: profile?.address ?? "",
      documentType: profile?.document_type ?? "",
      documentNumber: profile?.document_number ?? "",
    };

    const docFiles = detail.documents.map((d) => ({
      name: d.file_url?.split("/").pop() || d.file_url,
      url: d.file_url,
      type: d.document_type,
      status: d.status,
    }));
    const documents: DocumentData = { files: docFiles };

    const contractRow = detail.contracts[0];
    const contract: ContractData = {
      documentId: contractRow?.id ?? "",
      signedAt: contractRow?.signed_at ?? null,
      signed: contractRow?.signed ?? false,
      contractUrl: contractRow?.contract_url ?? null,
    };

    const payment = detail.paymentMethods[0];
    const paymentData: PaymentData = {
      methodType: payment?.method_type ?? "",
      accountHolder: payment?.account_holder ?? "",
      accountNumber: payment?.account_number ?? "",
      bankName: payment?.bank_name ?? "",
    };

    const identity = detail.identityVerifications[0];
    const identityData: IdentityData = {
      status: identity?.status ?? "",
      verifiedAt: identity?.verified_at ?? null,
      notes: identity?.verification_notes ?? "",
    };

    const steps: { step: ContractorStep["step"]; label: string; data: unknown }[] = [
      { step: "personal_info", label: "Datos personales", data: personalInfo },
      { step: "document_upload", label: "Documentos", data: documents },
      { step: "contract_sign", label: "Firma de contrato", data: contract },
      { step: "payment_setup", label: "Método de pago", data: paymentData },
      { step: "identity_verification", label: "Verificación de identidad", data: identityData },
    ];

    return steps.map((s) => ({
      ...s,
      status: (statusMap[s.step] || "pending") as ContractorStep["status"],
      data: s.data as ContractorStep["data"],
    })) as ContractorStep[];
  }, [detail]);

  const handleApprove = async (stepIndex: number) => {
    if (!detail?.profile || !resolvedSteps) return;
    const stepName = resolvedSteps[stepIndex].step;
    setReviewingStep(stepName);
    try {
      await reviewMutation.mutateAsync({
        profileId: detail.profile.id,
        stepName,
        action: "approve",
      });
      showToast(`Paso "${resolvedSteps[stepIndex].label}" aprobado`, undefined, "success");
    } catch {
      showToast("Error al aprobar el paso", undefined, "error");
    } finally {
      setReviewingStep(null);
    }
  };

  const handleReject = async (stepIndex: number) => {
    if (!detail?.profile || !resolvedSteps) return;
    const stepName = resolvedSteps[stepIndex].step;
    setReviewingStep(stepName);
    try {
      await reviewMutation.mutateAsync({
        profileId: detail.profile.id,
        stepName,
        action: "reject",
        notes: "Rechazado por el operador",
      });
      showToast(`Paso "${resolvedSteps[stepIndex].label}" rechazado`, undefined, "error");
    } catch {
      showToast("Error al rechazar el paso", undefined, "error");
    } finally {
      setReviewingStep(null);
    }
  };

  const handleRevertToPending = async (stepIndex: number) => {
    if (!detail?.profile || !resolvedSteps) return;
    const stepName = resolvedSteps[stepIndex].step;
    setReviewingStep(stepName);
    try {
      await reviewMutation.mutateAsync({
        profileId: detail.profile.id,
        stepName,
        action: "reset",
      });
      showToast(`Paso "${resolvedSteps[stepIndex].label}" revertido a pendiente`, undefined, "success");
    } catch {
      showToast("Error al revertir el paso", undefined, "error");
    } finally {
      setReviewingStep(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl flex items-center justify-center gap-3">
        <Loader2 size={20} className="animate-spin text-primary" />
        <p className="text-slate-500">Cargando contratista...</p>
      </div>
    );
  }

  if (error || !detail?.exists) {
    return (
      <div>
        <Link
          href="/admin/contractors"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver a Contratistas</span>
        </Link>
        <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl">
          <p className="text-red-500">Error al cargar el contratista</p>
        </div>
      </div>
    );
  }

  const user = detail.user;
  const profile = detail.profile;
  const name = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email;

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return { text: "Aprobado", classes: "text-green-600 bg-green-100" };
      case "rejected":
        return { text: "Rechazado", classes: "text-red-600 bg-red-100" };
      case "completed":
        return { text: "Completado", classes: "text-blue-600 bg-blue-100" };
      case "pending":
        return { text: "Pendiente", classes: "text-slate-400 bg-slate-100" };
      case "in_progress":
        return { text: "En Progreso", classes: "text-blue-600 bg-blue-100" };
      default:
        return { text: status, classes: "text-slate-400 bg-slate-100" };
    }
  };

  const renderStepContent = (step: ContractorStep) => {
    if (!step.data) {
      return (
        <p className="text-sm text-slate-400 italic">
          El contratista aún no ha enviado esta información.
        </p>
      );
    }
    switch (step.step) {
      case "personal_info":
        return <PersonalInfoPreview data={step.data as PersonalInfoData} />;
      case "document_upload":
        return <DocumentPreview data={step.data as DocumentData} />;
      case "contract_sign":
        return <ContractPreview data={step.data as ContractData} />;
      case "payment_setup":
        return <PaymentPreview data={step.data as PaymentData} />;
      case "identity_verification":
        return <IdentityPreview data={step.data as IdentityData} />;
      default:
        return null;
    }
  };

  const steps = resolvedSteps ?? [];

  return (
    <div>
      <Link
        href="/admin/contractors"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver a Contratistas</span>
      </Link>

      {/* Profile Header */}
      <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl mb-8">
        <div className="flex items-start gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-slate-500 mt-1">{user.email}</p>
              </div>
              <span className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100">
                {user.role === "admin" ? "Admin" : user.role === "operator" ? "Operador" : "Contratista"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Estado</p>
                <p className="font-medium capitalize">{profile?.onboarding_status || "Sin perfil"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Teléfono</p>
                <p className="font-medium">{user.phone || "No registrado"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Registro</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString("es-ES", { dateStyle: "long" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pasos de Onboarding</h2>
          <span className="text-sm text-slate-500">
            {steps.filter((s) => s.status === "approved" || s.status === "completed").length} de {steps.length} completados
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isExpanded = expandedStep === index;
            const badge = statusBadge(step.status);
            const isReviewing = reviewingStep === step.step;

            return (
              <div
                key={step.step}
                className="rounded-xl bg-white/50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{step.label}</p>
                      <span
                        className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.classes}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={20} className="text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-200">
                    <div className="pt-4 space-y-4">
                      {renderStepContent(step)}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleApprove(index)}
                          disabled={isReviewing}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "approved"
                              ? "bg-green-500 text-white cursor-default"
                              : "bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                          }`}
                        >
                          {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRevertToPending(index)}
                          disabled={isReviewing}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "pending" || step.status === "completed"
                              ? "bg-slate-400 text-white cursor-default"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                          }`}
                        >
                          {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                          Revertir
                        </button>
                        <button
                          onClick={() => handleReject(index)}
                          disabled={isReviewing}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "rejected"
                              ? "bg-red-500 text-white cursor-default"
                              : "bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                          }`}
                        >
                          {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log */}
      {detail.onboardingEvents.length > 0 && (
        <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Actividad reciente</h2>
          <div className="space-y-3">
            {detail.onboardingEvents.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-lg bg-white/50 p-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">{event.description || event.event_type}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(event.created_at).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })}
                    {event.performed_by_email && ` — por ${event.performed_by_email}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

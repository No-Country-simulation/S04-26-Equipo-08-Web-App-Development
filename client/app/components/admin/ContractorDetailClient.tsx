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
} from "lucide-react";
import { useUser } from "@/hooks/queries/useUsers";
import { useContractorProgress } from "@/hooks/queries/useContractorProgress";
import type { BackendUser } from "@/types/onboarding.types";
import type {
  ContractorStep,
  PersonalInfoData,
  DocumentData,
  ContractData,
  PaymentData,
  IdentityData,
} from "@/types/admin";

interface Props {
  id: string;
}

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
          <p className="font-medium text-slate-700">{f.value}</p>
        </div>
      ))}
    </div>
  );
}

function DocumentPreview({ data }: { data: DocumentData }) {
  const files = [
    { label: "Identificación", file: data.idFile, icon: "\u{1FAAA}" },
    { label: "Documentación fiscal", file: data.taxFile, icon: "\u{1F4C4}" },
  ];
  return (
    <div className="space-y-3">
      {files.map((f) => (
        <div key={f.label} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">{f.icon}</span>
            <div>
              <p className="text-sm font-medium text-slate-700">{f.label}</p>
              <p className="text-xs text-slate-400">
                {f.file.name || "No subido aun"}
              </p>
            </div>
          </div>
          {f.file.name && (
            <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
              <Download size={14} />
              Ver
            </button>
          )}
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
          <p className="text-xs text-slate-400 uppercase">ID del contrato</p>
          <p className="font-medium text-slate-700">{data.documentId}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase">Fecha de firma</p>
          <p className="font-medium text-slate-700">
            {new Date(data.signedAt).toLocaleDateString("es-ES", {
              dateStyle: "long",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        <FileText size={18} className="text-primary" />
        <span className="text-sm text-slate-600">Contrato firmado digitalmente</span>
      </div>
    </div>
  );
}

function PaymentPreview({ data }: { data: PaymentData }) {
  const methodLabels: Record<string, string> = {
    bank_transfer: "Transferencia bancaria",
    crypto: "Criptomonedas",
    cash: "Efectivo",
  };
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-xs text-slate-400 uppercase">Metodo</p>
        <p className="font-medium text-slate-700">{methodLabels[data.methodType] || data.methodType}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Titular</p>
        <p className="font-medium text-slate-700">{data.accountHolder}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Cuenta</p>
        <p className="font-medium text-slate-700">{data.accountNumber}</p>
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase">Banco</p>
        <p className="font-medium text-slate-700">{data.bankName}</p>
      </div>
    </div>
  );
}

function IdentityPreview({ data }: { data: IdentityData }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase">Estado</p>
          <p className="font-medium text-slate-700">
            {data.status === "verified"
              ? "Verificado"
              : data.status === "failed"
              ? "Fallo"
              : "Pendiente"}
          </p>
        </div>
        {data.verifiedAt && (
          <div>
            <p className="text-xs text-slate-400 uppercase">Verificado el</p>
            <p className="font-medium text-slate-700">
              {new Date(data.verifiedAt).toLocaleDateString("es-ES", {
                dateStyle: "long",
              })}
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

function buildSteps(user: BackendUser, stepsFromDb?: { step_name: string; completed: boolean }[]): ContractorStep[] {
  const name = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email;

  const statusMap: Record<string, string> = {};
  if (stepsFromDb) {
    for (const s of stepsFromDb) {
      statusMap[s.step_name] = s.completed ? "completed" : "pending";
    }
  }

  const mockPersonalInfo: PersonalInfoData = {
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    email: user.email,
    phone: user.phone ?? "",
    birthDate: "1990-01-15",
    country: "No especificado",
    city: "No especificado",
    address: "No especificado",
    documentType: "passport",
    documentNumber: "PEND-001",
  };
  const mockDoc: DocumentData = {
    idFile: { name: "identificacion_pendiente.pdf", url: "#" },
    taxFile: { name: "documento_fiscal_pendiente.pdf", url: "#" },
  };
  const mockContract: ContractData = {
    documentId: "SP-" + Date.now().toString(36),
    signedAt: new Date().toISOString(),
    signatureImage: "/signature-placeholder.png",
  };
  const mockPayment: PaymentData = {
    methodType: "bank_transfer",
    accountHolder: name,
    accountNumber: "****0000",
    bankName: "Por confirmar",
  };
  const mockIdentity: IdentityData = {
    status: "pending",
    verifiedAt: null,
    notes: "Pendiente de verificacion",
  };

  const steps: { step: ContractorStep["step"]; label: string; data: unknown }[] = [
    { step: "personal_info", label: "Datos personales", data: mockPersonalInfo },
    { step: "document_upload", label: "Documentos", data: mockDoc },
    { step: "contract_sign", label: "Firma de contrato", data: mockContract },
    { step: "payment_setup", label: "Metodo de pago", data: mockPayment },
    { step: "identity_verification", label: "Verificacion de identidad", data: mockIdentity },
  ];

  return steps.map((s) => ({
    ...s,
    status: statusMap[s.step] || "pending",
    data: s.data as ContractorStep["data"],
  })) as ContractorStep[];
}

export default function ContractorDetailClient({ id }: Props) {
  const { data: user, isLoading, error } = useUser(id);
  const { data: progress } = useContractorProgress(id);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const [steps, setSteps] = useState<ContractorStep[] | null>(null);

  const resolvedSteps = useMemo(() => {
    if (steps) return steps;
    if (!user) return null;
    return buildSteps(user, progress?.steps);
  }, [user, progress, steps]);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl">
        <p className="text-slate-500">Cargando contratista...</p>
      </div>
    );
  }

  if (error || !user) {
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

  const name = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || user.email;

  const handleApprove = (stepIndex: number) => {
    setSteps((prev) => {
      const current = prev ?? buildSteps(user, progress?.steps);
      const copy = current.map((s, i) => (i === stepIndex ? { ...s, status: "approved" as const } : s));
      return copy;
    });
  };

  const handleReject = (stepIndex: number) => {
    setSteps((prev) => {
      const current = prev ?? buildSteps(user, progress?.steps);
      const copy = current.map((s, i) => (i === stepIndex ? { ...s, status: "rejected" as const } : s));
      return copy;
    });
  };

  const handleRevertToPending = (stepIndex: number) => {
    setSteps((prev) => {
      const current = prev ?? buildSteps(user, progress?.steps);
      const wasCompleted = progress?.steps?.find((s) => s.step_name === current[stepIndex]?.step)?.completed;
      const copy = current.map((s, i) => (i === stepIndex ? { ...s, status: (wasCompleted ? "completed" : "pending") as const } : s));
      return copy;
    });
  };

  const approvedCount = (resolvedSteps ?? []).filter(
    (s) => s.status === "approved"
  ).length;

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
          El contratista aun no ha enviado esta informacion.
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
                <p className="text-xs text-slate-500 uppercase font-semibold">Rol</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Telefono</p>
                <p className="font-medium">{user.phone || "No registrado"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Registro</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString("es-ES", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-3xl bg-[#e8eaf0] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pasos de Onboarding</h2>
          <span className="text-sm text-slate-500">
            {approvedCount} de {resolvedSteps?.length ?? 0} aprobados
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 italic">
          * El estado de cada paso refleja el progreso real. Los datos de detalle son de demostracion.
        </p>

        <div className="space-y-3">
          {(resolvedSteps ?? []).map((step, index) => {
            const isExpanded = expandedStep === index;
            const badge = statusBadge(step.status);

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
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "approved"
                              ? "bg-green-500 text-white cursor-default"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <CheckCircle size={16} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRevertToPending(index)}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "pending" || step.status === "completed"
                              ? "bg-slate-400 text-white cursor-default"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Clock size={16} />
                          Revertir
                        </button>
                        <button
                          onClick={() => handleReject(index)}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            step.status === "rejected"
                              ? "bg-red-500 text-white cursor-default"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <XCircle size={16} />
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
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Contractor, PersonalInfoData, DocumentData, ContractData, PaymentData, IdentityData } from "@/types/admin";
import { statusColors } from "@/data/admin-data";

interface Props {
  contractor: Contractor;
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
    { label: "Identificación", file: data.idFile, icon: "🪪" },
    { label: "Documentación fiscal", file: data.taxFile, icon: "📄" },
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
                {f.file.name || "No subido aún"}
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
        <p className="text-xs text-slate-400 uppercase">Método</p>
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
              ? "Falló"
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

export default function ContractorDetailClient({ contractor: initial }: Props) {
  const [contractor, setContractor] = useState(initial);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const handleApprove = (stepIndex: number) => {
    setContractor((prev) => {
      const steps = [...prev.steps];
      steps[stepIndex] = { ...steps[stepIndex], status: "approved" };
      return { ...prev, steps };
    });
  };

  const handleReject = (stepIndex: number) => {
    setContractor((prev) => {
      const steps = [...prev.steps];
      steps[stepIndex] = { ...steps[stepIndex], status: "rejected" };
      return { ...prev, steps };
    });
  };

  const handleRevertToPending = (stepIndex: number) => {
    setContractor((prev) => {
      const steps = [...prev.steps];
      steps[stepIndex] = { ...steps[stepIndex], status: "pending" };
      return { ...prev, steps };
    });
  };

  const approvedCount = contractor.steps.filter(
    (s) => s.status === "approved"
  ).length;

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return { text: "Aprobado", classes: "text-green-600 bg-green-100" };
      case "rejected":
        return { text: "Rechazado", classes: "text-red-600 bg-red-100" };
      case "pending":
        return { text: "Pendiente", classes: "text-slate-400 bg-slate-100" };
      case "in_progress":
        return { text: "En Progreso", classes: "text-blue-600 bg-blue-100" };
      default:
        return { text: status, classes: "text-slate-400 bg-slate-100" };
    }
  };

  const renderStepContent = (step: (typeof contractor.steps)[0]) => {
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
          <Image
            width={120}
            height={120}
            src={contractor.image}
            alt={contractor.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{contractor.name}</h1>
                <p className="text-slate-500 mt-1">{contractor.email}</p>
              </div>
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${
                  statusColors[contractor.status]
                }`}
              >
                {contractor.status === "Verified"
                  ? "Verificado"
                  : contractor.status === "Pending Review"
                  ? "Pendiente"
                  : "En Revisión"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Especialidad</p>
                <p className="font-medium">{contractor.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">País</p>
                <p className="font-medium">{contractor.country}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Teléfono</p>
                <p className="font-medium">{contractor.phone}</p>
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
            {approvedCount} de {contractor.steps.length} aprobados
          </span>
        </div>

        <div className="space-y-3">
          {contractor.steps.map((step, index) => {
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
                            step.status === "pending"
                              ? "bg-slate-400 text-white cursor-default"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Clock size={16} />
                          Pendiente
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

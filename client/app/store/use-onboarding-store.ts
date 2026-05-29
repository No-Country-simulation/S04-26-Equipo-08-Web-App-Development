import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StepName =
  | 'personal_info'
  | 'document_upload'
  | 'contract_sign'
  | 'payment_setup'
  | 'identity_verification'

export const STEPS: StepName[] = [
  'personal_info',
  'document_upload',
  'contract_sign',
  'payment_setup',
  'identity_verification',
]

export const STEP_LABELS: Record<StepName, string> = {
  personal_info: 'Datos personales',
  document_upload: 'Subir documentos',
  contract_sign: 'Firmar contrato',
  payment_setup: 'Método de pago',
  identity_verification: 'Verificar identidad',
}

type PersonalInfo = {
  firstname: string
  lastname: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  document_type: string
  document_number: string
  birth_date: string
}

type DocumentUpload = {
  files: Record<string, File | null>
}

type PaymentData = {
  method_type: 'bank_transfer' | 'crypto' | 'cash'
  account_holder: string
  account_number: string
  bank_name: string
  swift_code: string
  wallet_address: string
}

type OnboardingStore = {
  currentStep: number
  completedSteps: StepName[]
  personalInfo: PersonalInfo
  documents: DocumentUpload
  payment: PaymentData
  contractSigned: boolean
  signatureData: string | null
  isComplete: boolean

  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  completeStep: (stepName: StepName) => void
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updateDocuments: (data: Partial<DocumentUpload>) => void
  updatePayment: (data: Partial<PaymentData>) => void
  signContract: (signatureData: string) => void
  reset: () => void
}

const initialPersonalInfo: PersonalInfo = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  document_type: '',
  document_number: '',
  birth_date: '',
}

const initialDocuments: DocumentUpload = {
  files: {},
}

const initialPayment: PaymentData = {
  method_type: 'bank_transfer',
  account_holder: '',
  account_number: '',
  bank_name: '',
  swift_code: '',
  wallet_address: '',
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      completedSteps: [],
      personalInfo: initialPersonalInfo,
      documents: initialDocuments,
      payment: initialPayment,
      contractSigned: false,
      signatureData: null,
      isComplete: false,

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(STEPS[state.currentStep])
            ? state.completedSteps
            : [...state.completedSteps, STEPS[state.currentStep]],
          currentStep: Math.min(state.currentStep + 1, STEPS.length - 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      completeStep: (stepName) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepName)
            ? state.completedSteps
            : [...state.completedSteps, stepName],
        })),

      updatePersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        })),

      updateDocuments: (data) =>
        set((state) => ({
          documents: { ...state.documents, ...data },
        })),

      updatePayment: (data) =>
        set((state) => ({
          payment: { ...state.payment, ...data },
        })),

      signContract: (signatureData) =>
        set({
          contractSigned: true,
          signatureData,
        }),

      reset: () =>
        set({
          currentStep: 0,
          completedSteps: [],
          personalInfo: initialPersonalInfo,
          documents: initialDocuments,
          payment: initialPayment,
          contractSigned: false,
          signatureData: null,
          isComplete: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        payment: state.payment,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        contractSigned: state.contractSigned,
        signatureData: state.signatureData,
      }),
    }
  )
)

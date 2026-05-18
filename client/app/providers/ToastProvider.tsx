// components/providers/ToastProvider.tsx

'use client';

import * as Toast from '@radix-ui/react-toast';
import {
  createContext,
  useContext,
  useState,
} from 'react';

type ToastType =
  | 'success'
  | 'error'
  | 'info';

type ToastState = {
  open: boolean;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (
    title: string,
    description?: string,
    type?: ToastType
  ) => void;
};

const ToastContext =
  createContext<ToastContextType | null>(
    null
  );

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [toast, setToast] =
    useState<ToastState>({
      open: false,
      title: '',
      description: '',
      type: 'info',
    });

  function showToast(
    title: string,
    description?: string,
    type: ToastType = 'info'
  ) {
    setToast({
      open: true,
      title,
      description,
      type,
    });
  }

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      <Toast.Provider swipeDirection="right">

        {children}

        <Toast.Root
          open={toast.open}
          onOpenChange={(open) =>
            setToast((prev) => ({
              ...prev,
              open,
            }))
          }
          className={`
            fixed right-4 top-4 z-50
            min-w-[320px]
            rounded-xl border
            p-4 shadow-xl
            backdrop-blur-md
            transition-all

            ${
              toast.type === 'success'
                ? 'border-green-500 bg-green-500/10'
                : ''
            }

            ${
              toast.type === 'error'
                ? 'border-red-500 bg-red-500/10'
                : ''
            }

            ${
              toast.type === 'info'
                ? 'border-blue-500 bg-blue-500/10'
                : ''
            }
          `}
        >
          <Toast.Title className="font-semibold">
            {toast.title}
          </Toast.Title>

          {toast.description && (
            <Toast.Description className="mt-1 text-sm opacity-80">
              {toast.description}
            </Toast.Description>
          )}
        </Toast.Root>

        <Toast.Viewport />

      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useAppToast() {

  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useAppToast must be used inside ToastProvider'
    );
  }

  return context;
}
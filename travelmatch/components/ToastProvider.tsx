import React, { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    console.log(`[TOAST ${type.toUpperCase()}]`, message);
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Contenedor de toasts */}
      <div className="fixed inset-x-0 bottom-4 flex justify-center z-50 pointer-events-none">
        <div className="flex flex-col gap-2 max-w-sm w-full px-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl px-4 py-3 shadow-lg text-sm border backdrop-blur bg-white/90 ${
                toast.type === 'success'
                  ? 'border-emerald-200 text-emerald-800'
                  : toast.type === 'error'
                  ? 'border-red-200 text-red-700'
                  : 'border-sky-200 text-sky-800'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};


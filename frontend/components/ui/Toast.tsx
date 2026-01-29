'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
}

let addToast: ((toast: ToastProps) => void) | null = null;

export const toast = (toastProps: ToastProps) => {
  if (addToast) {
    addToast(toastProps);
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  useEffect(() => {
    addToast = (toastProps) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = { ...toastProps, id };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, toastProps.duration || 5000);
    };

    return () => {
      addToast = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`max-w-sm p-4 border rounded-lg shadow-lg ${getBgColor(toast.type)}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
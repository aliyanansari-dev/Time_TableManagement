import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div id="toastContainer" className="toast-container">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'error'
            ? 'fa-exclamation-circle'
            : toast.type === 'success'
            ? 'fa-check-circle'
            : 'fa-info-circle';

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <i className={`fas ${icon}`}></i>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};

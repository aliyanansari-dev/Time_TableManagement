import React, { useEffect, useState } from 'react';
import { attendanceService, QrData } from '../services/attendanceService';

interface QrModalProps {
  isOpen: boolean;
  activeYear: string;
  onClose: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  activeYear,
  onClose,
  onShowToast
}) => {
  const [qrData, setQrData] = useState<QrData | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins

  useEffect(() => {
    if (isOpen) {
      const generated = attendanceService.generateQrCode(`slot-${activeYear}-${Date.now()}`, activeYear, 1);
      setQrData(generated);
      setSecondsRemaining(900);
    }
  }, [isOpen, activeYear]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // auto-rotate QR code
          const newQr = attendanceService.generateQrCode(`slot-${activeYear}-${Date.now()}`, activeYear, 1);
          setQrData(newQr);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeYear]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const copyCode = () => {
    if (qrData?.code) {
      navigator.clipboard.writeText(qrData.code);
      onShowToast('Passcode copied to clipboard!', 'success');
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container" style={{ textAlign: 'center', maxWidth: '380px' }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-qrcode" style={{ color: 'var(--secondary-light)', marginRight: '0.4rem' }}></i>
            Attendance Check-in QR
          </h2>
          <button
            type="button"
            className="close-btn"
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div
          style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            width: '220px',
            margin: '0.5rem auto 1rem auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <i className="fas fa-qrcode" style={{ fontSize: '130px', color: '#0f172a' }}></i>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              background: 'var(--bg-muted)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={copyCode}
            title="Click to copy passcode"
          >
            {qrData?.code} <i className="fas fa-copy" style={{ marginLeft: '4px', opacity: 0.7 }}></i>
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0.5rem 0' }}>
          Expires in <strong style={{ color: '#f59e0b' }}>{timeFormatted}</strong>. Students scan in app to verify attendance.
        </p>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
          onClick={() => {
            const rotated = attendanceService.generateQrCode(`slot-${activeYear}-${Date.now()}`, activeYear, 1);
            setQrData(rotated);
            setSecondsRemaining(900);
            onShowToast('Refreshed QR Code token with new 15-min validity!', 'info');
          }}
        >
          <i className="fas fa-sync"></i> Refresh QR Code Now
        </button>
      </div>
    </div>
  );
};

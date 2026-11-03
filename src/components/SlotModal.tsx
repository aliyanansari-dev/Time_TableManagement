import React, { useEffect, useState } from 'react';
import { Dataset, TimetableSlot } from '../types';
import { schedulingService } from '../services/schedulingService';

interface SlotModalProps {
  isOpen: boolean;
  day: string;
  period: number;
  existingSlot?: TimetableSlot;
  activeYear: string;
  dataset: Dataset;
  onClose: () => void;
  onSave: (day: string, period: number, subject: string, teacher: string, room: string) => void;
  onDelete: (day: string, period: number) => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  isOpen,
  day,
  period,
  existingSlot,
  activeYear,
  dataset,
  onClose,
  onSave,
  onDelete,
  onShowToast
}) => {
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    if (existingSlot) {
      setSubject(existingSlot.subject);
      setTeacher(existingSlot.teacher);
      setRoom(existingSlot.room);
    } else {
      setSubject('');
      setTeacher(dataset.teachers[0]?.name || '');
      setRoom(dataset.rooms[0] || '');
    }
  }, [existingSlot, isOpen, dataset]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSubject = subject.trim();
    if (!cleanSubject) {
      onShowToast('Please enter subject code/title', 'error');
      return;
    }

    const conflicts = schedulingService.checkConflicts(activeYear, day, period, teacher, room, dataset);
    if (conflicts.hasConflict) {
      // Check if it's not just the current slot
      const isSelf = existingSlot && existingSlot.teacher === teacher && existingSlot.room === room;
      if (!isSelf && conflicts.conflicts.length > 0) {
        onShowToast(`CONFLICT BLOCKED: ${conflicts.conflicts[0]}`, 'error');
        return;
      }
    }

    onSave(day, period, cleanSubject, teacher, room);
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <i className="fas fa-edit" style={{ color: 'var(--secondary-light)', marginRight: '0.5rem' }}></i>
            Manage Period {period} ({day})
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fas fa-book" style={{ marginRight: '0.4rem' }}></i> Subject Code & Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CIT-392(P) or Math-123"
              style={{ paddingLeft: '0.75rem' }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-user-tie" style={{ marginRight: '0.4rem' }}></i> Assigned Instructor / Teacher
            </label>
            <select
              className="form-select"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              required
            >
              {dataset.teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-door-open" style={{ marginRight: '0.4rem' }}></i> Assigned Lab / Room
            </label>
            <select
              className="form-select"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            >
              {dataset.rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1.25rem' }}>
            {existingSlot ? (
              <button
                type="button"
                className="btn"
                style={{ background: '#ef4444', color: 'white' }}
                onClick={() => onDelete(day, period)}
              >
                <i className="fas fa-trash"></i> Delete Slot
              </button>
            ) : (
              <div></div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> Save Period
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

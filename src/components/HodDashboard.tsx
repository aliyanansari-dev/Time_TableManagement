import React, { useState } from 'react';
import { Dataset, Teacher } from '../types';
import { schedulingService } from '../services/schedulingService';
import { exportService } from '../services/exportService';

interface HodDashboardProps {
  dataset: Dataset;
  onRunGenerator: () => void;
  onOpenQrModal: () => void;
  onResetSchedule: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const HodDashboard: React.FC<HodDashboardProps> = ({
  dataset,
  onRunGenerator,
  onOpenQrModal,
  onResetSchedule,
  onShowToast
}) => {
  // Substitution Suggester State
  const [absentTeacher, setAbsentTeacher] = useState<string>(dataset.teachers[0]?.name || '');
  const [subDay, setSubDay] = useState<string>('Monday');
  const [subPeriod, setSubPeriod] = useState<number>(1);
  const [subSubject, setSubSubject] = useState<string>('CIT-392(P)');
  const [substitutes, setSubstitutes] = useState<
    Array<{ teacher: string; designation: string; workload: number; score: number }> | null
  >(null);

  const handleSuggestSubstitute = () => {
    const results = schedulingService.rankSubstitutes(
      absentTeacher,
      subSubject,
      subDay,
      subPeriod,
      dataset.teachers,
      dataset
    );
    setSubstitutes(results);
    onShowToast(`Found ${results.length} available faculty members for substitution.`, 'success');
  };

  const handleExportCsv = () => {
    const csv = exportService.generateCsvReport(dataset);
    exportService.downloadFile(csv, 'GCT_CIT_Timetable_Report.csv', 'text/csv');
    onShowToast('Accreditation CSV report downloaded successfully!', 'success');
  };

  return (
    <section id="hodDashboardView" style={{ marginTop: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Automated Schedule Generator */}
        <div className="notice-card" style={{ borderLeftColor: 'var(--secondary-light)' }}>
          <h4 style={{ fontWeight: 700 }}>
            <i className="fas fa-robot" style={{ marginRight: '0.4rem', color: 'var(--secondary-light)' }}></i>
            Automated Schedule Generator
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
            Constraint-satisfaction backtracking generator optimizing room and faculty distribution.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
            onClick={onRunGenerator}
          >
            <i className="fas fa-magic"></i> Generate Draft Timetable
          </button>
        </div>

        {/* Dynamic QR Attendance */}
        <div className="notice-card" style={{ borderLeftColor: '#10b981' }}>
          <h4 style={{ fontWeight: 700 }}>
            <i className="fas fa-qrcode" style={{ marginRight: '0.4rem', color: '#10b981' }}></i>
            Dynamic QR Attendance
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
            Generate 15-minute rotating QR code and passcode for current class period check-in.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
            onClick={onOpenQrModal}
          >
            <i className="fas fa-qrcode"></i> Generate QR Code
          </button>
        </div>

        {/* Accreditation Report */}
        <div className="notice-card" style={{ borderLeftColor: '#f59e0b' }}>
          <h4 style={{ fontWeight: 700 }}>
            <i className="fas fa-file-excel" style={{ marginRight: '0.4rem', color: '#f59e0b' }}></i>
            Accreditation Report
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
            Export comprehensive filtered dataset to CSV/Excel for PBTE and DAE quality audits.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
            onClick={handleExportCsv}
          >
            <i className="fas fa-download"></i> Export CSV Report
          </button>
        </div>
      </div>

      {/* Smart Faculty Substitution Suggester */}
      <div className="notice-card" style={{ marginBottom: '1.5rem', borderLeftColor: '#8b5cf6' }}>
        <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-user-clock" style={{ color: '#8b5cf6', marginRight: '0.4rem' }}></i>
          Smart Faculty Substitution Suggester
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Select an absent teacher, day, and period to find available faculty ranked by CIT specialization and lower workload.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Absent Instructor
            </label>
            <select
              className="form-select"
              value={absentTeacher}
              onChange={(e) => setAbsentTeacher(e.target.value)}
            >
              {dataset.teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Day of Week
            </label>
            <select className="form-select" value={subDay} onChange={(e) => setSubDay(e.target.value)}>
              {dataset.days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Period Number
            </label>
            <select
              className="form-select"
              value={subPeriod}
              onChange={(e) => setSubPeriod(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Lec {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Subject Code
            </label>
            <input
              type="text"
              className="form-input"
              value={subSubject}
              onChange={(e) => setSubSubject(e.target.value)}
              placeholder="e.g. CIT-392(P)"
            />
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          style={{ fontSize: '0.85rem' }}
          onClick={handleSuggestSubstitute}
        >
          <i className="fas fa-search"></i> Find Ranked Substitutes
        </button>

        {substitutes && (
          <div style={{ marginTop: '1.25rem' }}>
            <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
              Ranked Available Substitutes ({substitutes.length})
            </h5>
            {substitutes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No free instructors found for {subDay} Lec {subPeriod}.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {substitutes.map((sub, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem',
                      background: 'var(--bg-muted)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{sub.teacher}</strong>
                      <span className="role-badge teacher" style={{ fontSize: '0.7rem' }}>
                        Score: {sub.score}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {sub.designation}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
                      <i className="fas fa-check-circle"></i> Free at Lec {subPeriod} ({sub.workload} periods/wk)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Controls Bar */}
      <div
        className="controls-bar non-printable"
        style={{ marginTop: '1.5rem', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-user-shield" style={{ color: 'var(--secondary-light)' }}></i>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            HOD / Faculty Operations Platform Active
          </span>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
            onClick={onResetSchedule}
          >
            <i className="fas fa-undo"></i> Reset Official Schedule
          </button>
        </div>
      </div>
    </section>
  );
};

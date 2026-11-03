import React from 'react';
import { Dataset, WeeklyTimetable } from '../types';

interface LabUsageProps {
  dataset: Dataset;
}

export const LabUsage: React.FC<LabUsageProps> = ({ dataset }) => {
  return (
    <section id="roomSection">
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '1.25rem 0 1rem 0' }}>
        <i className="fas fa-desktop" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
        Department Labs & Room Utilization
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {dataset.rooms.map((room) => {
          const roomSlots: Array<{
            year: string;
            day: string;
            period: number;
            subject: string;
            teacher: string;
          }> = [];

          ['1st', '2nd', '3rd'].forEach((y) => {
            const ttKey = `timetable_${y}` as keyof Dataset;
            const tt = (dataset[ttKey] as WeeklyTimetable) || {};
            dataset.days.forEach((d) => {
              (tt[d] || []).forEach((s) => {
                if (s.room.toLowerCase().includes(room.toLowerCase())) {
                  roomSlots.push({ year: y, day: d, ...s });
                }
              });
            });
          });

          return (
            <div key={room} className="notice-card" style={{ borderLeftColor: '#10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                  <i className="fas fa-desktop" style={{ color: '#10b981', marginRight: '0.4rem' }}></i>
                  {room}
                </h4>
                <span className="role-badge student">{roomSlots.length} Bookings</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                GCT Bhakkar CIT Building
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                {roomSlots.length === 0 ? (
                  <li style={{ color: 'var(--text-muted)' }}>Room available for scheduling.</li>
                ) : null}
                {roomSlots.slice(0, 4).map((s, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <strong>{s.day}</strong> (Lec {s.period}): {s.subject}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.teacher}</span>
                  </li>
                ))}
                {roomSlots.length > 4 && (
                  <li style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    + {roomSlots.length - 4} more slots
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

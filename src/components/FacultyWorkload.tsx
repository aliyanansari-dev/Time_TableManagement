import React from 'react';
import { Dataset, WeeklyTimetable } from '../types';

interface FacultyWorkloadProps {
  dataset: Dataset;
}

export const FacultyWorkload: React.FC<FacultyWorkloadProps> = ({ dataset }) => {
  return (
    <section id="teacherSection">
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '1.25rem 0 1rem 0' }}>
        <i className="fas fa-chalkboard-teacher" style={{ color: 'var(--secondary-light)', marginRight: '0.5rem' }}></i>
        Faculty Workload & Weekly Schedule
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {dataset.teachers.map((teacher) => {
          const assignedSlots: Array<{
            year: string;
            day: string;
            period: number;
            subject: string;
            room: string;
          }> = [];

          ['1st', '2nd', '3rd'].forEach((y) => {
            const ttKey = `timetable_${y}` as keyof Dataset;
            const tt = (dataset[ttKey] as WeeklyTimetable) || {};
            dataset.days.forEach((d) => {
              (tt[d] || []).forEach((s) => {
                if (
                  s.teacher.toLowerCase().includes(teacher.name.toLowerCase()) ||
                  teacher.name.toLowerCase().includes(s.teacher.toLowerCase())
                ) {
                  assignedSlots.push({ year: y, day: d, ...s });
                }
              });
            });
          });

          const isOverloaded = assignedSlots.length > 20;

          return (
            <div key={teacher.id} className="notice-card" style={{ borderLeftColor: 'var(--secondary-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{teacher.name}</h4>
                <span className={`role-badge ${isOverloaded ? 'hod' : 'teacher'}`}>
                  {assignedSlots.length} Periods/Wk {isOverloaded ? '(Overload)' : ''}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {teacher.designation}
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                {assignedSlots.length === 0 ? (
                  <li style={{ color: 'var(--text-muted)' }}>No assigned lectures.</li>
                ) : null}
                {assignedSlots.slice(0, 5).map((s, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <strong>{s.day}</strong> (Lec {s.period}): {s.subject}
                    </span>
                    <span className="slot-room">
                      {s.year} Yr | {s.room}
                    </span>
                  </li>
                ))}
                {assignedSlots.length > 5 && (
                  <li style={{ fontSize: '0.75rem', color: 'var(--secondary-light)', fontWeight: 600 }}>
                    + {assignedSlots.length - 5} more lectures
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

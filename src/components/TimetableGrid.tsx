import React from 'react';
import { CurrentUser, Dataset, Period, TimetableSlot, WeeklyTimetable } from '../types';
import { schedulingService } from '../services/schedulingService';

interface TimetableGridProps {
  dataset: Dataset;
  activeYear: string;
  searchQuery: string;
  currentUser: CurrentUser;
  onSlotClick: (day: string, period: number, existing?: TimetableSlot) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  dataset,
  activeYear,
  searchQuery,
  currentUser,
  onSlotClick
}) => {
  const isStaff =
    currentUser &&
    (currentUser.role === 'admin' ||
      currentUser.role === 'hod' ||
      currentUser.role === 'faculty' ||
      currentUser.role === 'teacher');

  // Karachi time helpers
  const getKarachiInfo = () => {
    const now = new Date();
    let kDate = now;
    try {
      kDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
    } catch (e) {
      // fallback
    }
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[kDate.getDay()];
    const currentMinutes = kDate.getHours() * 60 + kDate.getMinutes();

    let activePeriods: Period[] = dataset.periods;
    if (currentDay === 'Friday' && dataset.fridayPeriods) {
      activePeriods = dataset.fridayPeriods;
    } else if (activeYear === '1st' && dataset.periods_1st) {
      activePeriods = dataset.periods_1st;
    }

    let activePeriodNum: number | string | null = null;
    activePeriods.forEach(p => {
      if (p.start && p.end) {
        const [sH, sM] = p.start.split(':').map(Number);
        const [eH, eM] = p.end.split(':').map(Number);
        if (currentMinutes >= sH * 60 + sM && currentMinutes < eH * 60 + eM) {
          activePeriodNum = p.num;
        }
      }
    });

    return { currentDay, activePeriodNum };
  };

  const { currentDay, activePeriodNum } = getKarachiInfo();

  const getPeriodsForDay = (day: string): Period[] => {
    if (day === 'Friday' && dataset.fridayPeriods) {
      return dataset.fridayPeriods;
    }
    if (activeYear === '1st' && dataset.periods_1st) {
      return dataset.periods_1st;
    }
    return dataset.periods;
  };

  const headerPeriods = getPeriodsForDay('Monday');
  const ttKey = `timetable_${activeYear}` as keyof Dataset;
  const timetableData = (dataset[ttKey] as WeeklyTimetable) || {};

  return (
    <div id="timetableGridContainer" className="timetable-container">
      {/* Official printable header */}
      <div className="printable-official-header">
        <h2>{dataset.institution.college}</h2>
        <h3>
          {dataset.institution.department} ({dataset.institution.program})
        </h3>
        <p>
          TIME TABLE - {activeYear.toUpperCase()} YEAR CIT ({dataset.institution.session}) |{' '}
          {dataset.institution.shift} | w.e.f {dataset.institution.wef}
        </p>
        <p style={{ fontSize: '8pt', color: '#475569' }}>
          Generated on: {new Date().toLocaleDateString()}
        </p>
      </div>

      <table className="timetable-table">
        <thead>
          <tr>
            <th className="day-cell">Day / Period</th>
            {headerPeriods.map((p, idx) => (
              <th key={idx} className={p.isBreak ? 'break-col-header' : ''}>
                {p.label}
                <div style={{ fontSize: '0.72rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                  {p.time}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataset.days.map((day) => {
            const isDayLive = day === currentDay;
            const isFriday = day === 'Friday';
            const rowPeriods = getPeriodsForDay(day);

            return (
              <tr key={day}>
                <td
                  className={`day-cell ${isDayLive ? 'live-day-header' : ''}`}
                  style={isFriday ? { borderLeft: '4px solid #f59e0b' } : undefined}
                >
                  {day}
                  {isFriday && (
                    <>
                      <br />
                      <span
                        style={{
                          fontSize: '0.58rem',
                          color: '#f59e0b',
                          fontWeight: 800,
                          letterSpacing: '0.05em'
                        }}
                      >
                        🕌 SPECIAL TIMING
                      </span>
                    </>
                  )}
                </td>

                {rowPeriods.map((p, pIdx) => {
                  if (p.isBreak) {
                    if (isFriday) {
                      return (
                        <td
                          key={pIdx}
                          className="break-cell"
                          style={{
                            background:
                              'repeating-linear-gradient(45deg,rgba(245,158,11,0.10),rgba(245,158,11,0.10) 6px,transparent 6px,transparent 12px)',
                            borderLeft: '2px dashed #f59e0b',
                            borderRight: '2px dashed #f59e0b',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            padding: '6px 4px'
                          }}
                        >
                          <div style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>🕌</div>
                          <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#92400e', marginTop: '2px' }}>
                            JUMMA
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#b45309', fontWeight: 700 }}>{p.time}</div>
                        </td>
                      );
                    }
                    return (
                      <td key={pIdx} className="break-cell">
                        ☕<br />
                        <span style={{ fontSize: '0.7rem' }}>BREAK</span>
                        <br />
                        <span style={{ fontSize: '0.62rem', opacity: 0.7 }}>{p.time}</span>
                      </td>
                    );
                  }

                  const slots = (timetableData[day] || []).filter((s) => s.period === p.num);
                  const slot = slots.length > 0 ? slots[0] : null;

                  let isMatch = true;
                  if (slot && searchQuery.trim()) {
                    const text = `${slot.subject} ${slot.teacher} ${slot.room}`.toLowerCase();
                    isMatch = text.includes(searchQuery.toLowerCase().trim());
                  }

                  const timeSub = isFriday ? (
                    <div
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: '#0284c7',
                        marginBottom: '4px',
                        letterSpacing: '0.01em'
                      }}
                    >
                      ⏱ {p.time}
                    </div>
                  ) : null;

                  if (slot && isMatch) {
                    const conflictCheck = isStaff
                      ? schedulingService.checkConflicts(activeYear, day, Number(p.num), slot.teacher, slot.room, dataset)
                      : { hasConflict: false, conflicts: [] };

                    let typeBadge = <span className="badge-type badge-theory">Lecture</span>;
                    if (slot.subject.includes('(P)')) {
                      typeBadge = <span className="badge-type badge-practical">Practical</span>;
                    } else if (slot.subject.includes('(T)') || slot.subject.includes('Theory')) {
                      typeBadge = <span className="badge-type badge-theory">Theory</span>;
                    }

                    const isLiveNow = day === currentDay && p.num === activePeriodNum;

                    return (
                      <td key={pIdx}>
                        <div
                          className={`slot-card ${isLiveNow ? 'live-active-slot' : ''}`}
                          data-day={day}
                          data-period={p.num}
                          onClick={() => onSlotClick(day, Number(p.num), slot)}
                          style={{ cursor: isStaff ? 'pointer' : 'default' }}
                        >
                          {isLiveNow && (
                            <span className="live-now-tag">
                              <i className="fas fa-satellite-dish"></i> LIVE
                            </span>
                          )}
                          {timeSub}
                          <div className="slot-subject-row">
                            <div className="slot-subject">{slot.subject}</div>
                            {typeBadge}
                          </div>
                          <div className="slot-teacher">
                            <i className="fas fa-user-tie"></i> {slot.teacher}
                          </div>
                          <div className="slot-room">
                            <i className="fas fa-door-open"></i> {slot.room}
                          </div>
                          {conflictCheck.hasConflict && (
                            <div
                              className="conflict-badge"
                              title={conflictCheck.conflicts.join('\n')}
                            >
                              <i className="fas fa-exclamation-triangle"></i> Conflict
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  } else if (slot && !isMatch) {
                    return (
                      <td key={pIdx}>
                        <div className="free-slot" style={{ opacity: 0.3 }}>
                          {timeSub}Hidden
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td key={pIdx}>
                        <div
                          className="free-slot"
                          onClick={() => (isStaff ? onSlotClick(day, Number(p.num)) : undefined)}
                          style={{ cursor: isStaff ? 'pointer' : 'default' }}
                        >
                          {timeSub}
                          {isStaff ? (
                            <>
                              <i className="fas fa-plus" style={{ fontSize: '0.75rem' }}></i> Add
                            </>
                          ) : (
                            'No Classes Scheduled'
                          )}
                        </div>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Printable signature footer */}
      <div className="printable-signature-footer">
        <div className="sig-box">{dataset.institution.signatories.incharge}</div>
        <div className="sig-box">{dataset.institution.signatories.hod}</div>
        <div className="sig-box">{dataset.institution.signatories.academic}</div>
      </div>
    </div>
  );
};

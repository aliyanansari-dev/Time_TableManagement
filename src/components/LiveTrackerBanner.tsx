import React, { useEffect, useState } from 'react';
import { Dataset, Period, WeeklyTimetable } from '../types';

interface LiveTrackerBannerProps {
  dataset: Dataset;
  activeYear: string;
  optimizationScore: number;
}

export const LiveTrackerBanner: React.FC<LiveTrackerBannerProps> = ({
  dataset,
  activeYear,
  optimizationScore
}) => {
  const [ongoingLabel, setOngoingLabel] = useState('ONGOING CLASS');
  const [mainText, setMainText] = useState('Checking schedule...');
  const [progressPct, setProgressPct] = useState(0);
  const [bannerClass, setBannerClass] = useState('');

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      let karachiDate = now;
      try {
        karachiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
      } catch (e) {
        // fallback
      }

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = dayNames[karachiDate.getDay()];
      const currentMinutes = karachiDate.getHours() * 60 + karachiDate.getMinutes();
      const currentSeconds = karachiDate.getHours() * 3600 + karachiDate.getMinutes() * 60 + karachiDate.getSeconds();

      if (currentDay === 'Sunday') {
        setOngoingLabel('CLOSED');
        setMainText('Sunday — Department Closed (No Classes)');
        setBannerClass('is-free');
        setProgressPct(0);
        return;
      }

      // Determine period set
      let activePeriods: Period[] = dataset.periods;
      if (currentDay === 'Friday' && dataset.fridayPeriods) {
        activePeriods = dataset.fridayPeriods;
      } else if (activeYear === '1st' && dataset.periods_1st) {
        activePeriods = dataset.periods_1st;
      }

      let activePeriodInfo: Period | null = null;
      activePeriods.forEach(p => {
        if (p.start && p.end) {
          const [sH, sM] = p.start.split(':').map(Number);
          const [eH, eM] = p.end.split(':').map(Number);
          if (currentMinutes >= sH * 60 + sM && currentMinutes < eH * 60 + eM) {
            activePeriodInfo = p;
          }
        }
      });

      if (activePeriodInfo) {
        const [sH, sM] = (activePeriodInfo as Period).start!.split(':').map(Number);
        const [eH, eM] = (activePeriodInfo as Period).end!.split(':').map(Number);
        const startSec = sH * 3600 + sM * 60;
        const endSec = eH * 3600 + eM * 60;
        const pct = Math.min(100, Math.max(0, ((currentSeconds - startSec) / (endSec - startSec)) * 100));
        setProgressPct(pct);

        if ((activePeriodInfo as Period).isBreak) {
          setBannerClass('is-break');
          setOngoingLabel(currentDay === 'Friday' ? '🕌 JUMMA PRAYER' : '☕ BREAK TIME');
          setMainText(`${(activePeriodInfo as Period).label} · ${(activePeriodInfo as Period).time}`);
        } else {
          setBannerClass('');
          setOngoingLabel('ONGOING CLASS');
          const ttKey = `timetable_${activeYear}` as keyof Dataset;
          const tt = (dataset[ttKey] as WeeklyTimetable) || {};
          const slot = (tt[currentDay] || []).find(s => s.period === (activePeriodInfo as Period).num);

          if (slot) {
            setMainText(`${(activePeriodInfo as Period).label} · ${slot.subject} — ${slot.teacher} · ${slot.room}`);
          } else {
            setMainText(`${(activePeriodInfo as Period).label} · Free Period / Lab Practice`);
          }
        }
      } else {
        setBannerClass('is-free');
        setOngoingLabel('SCHEDULE');
        setProgressPct(0);
        setMainText(`Afternoon Shift: 12:10 PM – 05:20 PM · ${currentDay}`);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [dataset, activeYear]);

  return (
    <div id="liveTrackerBanner" className={`live-tracker-banner non-printable ${bannerClass}`}>
      {/* LEFT: shift + pulse */}
      <div className="tracker-left">
        <div className="pulse-dot"></div>
        <div>
          <div className="tracker-shift-label">Afternoon Shift</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, fontFamily: "'Inter', sans-serif" }}>
            LIVE · 12:10 PM – 05:20 PM
          </div>
        </div>
      </div>

      {/* CENTER: current class info */}
      <div className="tracker-center">
        <div className="tracker-ongoing-label">{ongoingLabel}</div>
        <div id="activePeriodText" className="tracker-main-text">
          {mainText}
        </div>
        <div className="tracker-sub-text">GCT Bhakkar · CIT Department · Self Finance</div>
      </div>

      {/* RIGHT: status chips */}
      <div className="tracker-right">
        <span id="optimizationScoreBadge" className="tracker-chip">
          <i className="fas fa-chart-line"></i> Optimization: {optimizationScore}/100
        </span>
        <span className="tracker-chip">
          <i className="fas fa-database"></i> Database Active
        </span>
      </div>

      {/* Progress bar (3px bottom strip) */}
      <div className="tracker-progress-bar">
        <div
          id="trackerProgressFill"
          className="tracker-progress-fill"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
    </div>
  );
};

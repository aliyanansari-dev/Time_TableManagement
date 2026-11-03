import React from 'react';
import { CurrentUser, Dataset } from '../types';

interface NoticeBoardProps {
  dataset: Dataset;
  currentUser: CurrentUser;
  onOpenPostNotice: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  dataset,
  currentUser,
  onOpenPostNotice
}) => {
  const isStaff =
    currentUser &&
    (currentUser.role === 'admin' ||
      currentUser.role === 'hod' ||
      currentUser.role === 'faculty' ||
      currentUser.role === 'teacher');

  return (
    <section id="noticesSection">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.25rem 0 1rem 0' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          <i className="fas fa-bullhorn" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i>
          Department Announcements & Notices
        </h3>
        {isStaff && (
          <button className="btn btn-primary" onClick={onOpenPostNotice}>
            <i className="fas fa-plus"></i> Post Notice
          </button>
        )}
      </div>

      <div id="noticesContainer">
        {dataset.announcements.length === 0 ? (
          <div className="free-slot" style={{ padding: '2rem' }}>
            No notices posted yet.
          </div>
        ) : (
          dataset.announcements.map((ann) => (
            <div key={ann.id} className="notice-card" style={{ marginBottom: '1rem' }}>
              <div className="notice-meta">
                <span>
                  <i className="fas fa-bullhorn"></i> {ann.author} &bull; {ann.category}
                </span>
                <span>
                  <i className="fas fa-calendar-alt"></i> {ann.date}
                </span>
              </div>
              <h4
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginBottom: '0.35rem',
                  color: 'var(--text)'
                }}
              >
                {ann.title}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {ann.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

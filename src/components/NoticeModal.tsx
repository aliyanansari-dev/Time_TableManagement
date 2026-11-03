import React, { useState } from 'react';
import { CurrentUser } from '../types';

interface NoticeModalProps {
  isOpen: boolean;
  currentUser: CurrentUser;
  onClose: () => void;
  onAddNotice: (title: string, content: string, category: string, author: string) => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onAddNotice
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Important');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const author = currentUser ? currentUser.name : 'HOD CIT';
    onAddNotice(title.trim(), content.trim(), category, author);
    setTitle('');
    setContent('');
    setCategory('Important');
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <i className="fas fa-bullhorn" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i>
            Post Department Announcement
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
            <label>Announcement Title</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '0.75rem' }}
              placeholder="e.g. Lab Maintenance Notice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Important">Important</option>
              <option value="Schedule Notice">Schedule Notice</option>
              <option value="Lab Notice">Lab Notice</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message Content</label>
            <textarea
              className="form-input"
              style={{ paddingLeft: '0.75rem', height: '100px' }}
              placeholder="Write announcement text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <i className="fas fa-paper-plane"></i> Post Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

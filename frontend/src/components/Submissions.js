import React from 'react';

const Submissions = () => {
  return (
    <div className="editor-container">
      <div className="editor-content">
        <div className="submissions-header">
          <h3>My Submissions</h3>
          <p className="text-muted">Your submission history for this problem</p>
        </div>
        
        <div className="submissions-table">
          <div className="submission-header">
            <span>Status</span>
            <span>Language</span>
            <span>Runtime</span>
            <span>Memory</span>
            <span>Submitted</span>
          </div>
          
          <div className="submission-row accepted">
            <span className="status">✓ Accepted</span>
            <span className="language">JavaScript</span>
            <span className="runtime">45ms</span>
            <span className="memory">2.1MB</span>
            <span className="time">2 hours ago</span>
          </div>
          
          <div className="submission-row error">
            <span className="status">✗ Wrong Answer</span>
            <span className="language">JavaScript</span>
            <span className="runtime">52ms</span>
            <span className="memory">2.3MB</span>
            <span className="time">3 hours ago</span>
          </div>
          
          <div className="submission-row error">
            <span className="status">✗ Runtime Error</span>
            <span className="language">TypeScript</span>
            <span className="runtime">-</span>
            <span className="memory">-</span>
            <span className="time">5 hours ago</span>
          </div>
          
          <div className="submission-row accepted">
            <span className="status">✓ Accepted</span>
            <span className="language">JavaScript</span>
            <span className="runtime">48ms</span>
            <span className="memory">2.0MB</span>
            <span className="time">1 day ago</span>
          </div>
        </div>
        
        <div className="submissions-stats">
          <div className="stat-item">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">12</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accepted</span>
            <span className="stat-value">8</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">66.7%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;

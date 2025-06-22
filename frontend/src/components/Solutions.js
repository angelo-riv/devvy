import React from 'react';

const Solutions = () => {
  const solution1 = `const solution = (requirements) => { // Clean implementation using modern ES6... }`;
  const solution2 = `interface DashboardProps { requirements: string[]; } // Full TypeScript...`;
  const solution3 = `const useTheme = () => { const [theme, setTheme] = useState('dark')... }`;

  return (
    <div className="editor-container">
      <div className="editor-content">
        <div className="solutions-header">
          <h3>Solutions</h3>
          <p className="text-muted">Community solutions for this problem</p>
        </div>

        <div className="solutions-list">
          <div className="solution-item">
            <div className="solution-meta">
              <span className="solution-author">@developer123</span>
              <span className="solution-lang">JavaScript</span>
              <span className="solution-stats">👍 45 💬 12</span>
            </div>
            <div className="solution-title">Efficient O(n) solution using HashMap approach</div>
            <div className="solution-preview">{solution1}</div>
          </div>

          <div className="solution-item">
            <div className="solution-meta">
              <span className="solution-author">@codemaster</span>
              <span className="solution-lang">TypeScript</span>
              <span className="solution-stats">👍 32 💬 8</span>
            </div>
            <div className="solution-title">Type-safe dashboard with comprehensive error handling</div>
            <div className="solution-preview">{solution2}</div>
          </div>

          <div className="solution-item">
            <div className="solution-meta">
              <span className="solution-author">@reactpro</span>
              <span className="solution-lang">JavaScript</span>
              <span className="solution-stats">👍 28 💬 15</span>
            </div>
            <div className="solution-title">React hooks-based solution with custom theme system</div>
            <div className="solution-preview">{solution3}</div>
          </div>
        </div>

        <div className="solutions-actions">
          <button className="btn-outline">Load More Solutions</button>
          <button className="btn-primary">Share Your Solution</button>
        </div>
      </div>
    </div>
  );
};

export default Solutions;

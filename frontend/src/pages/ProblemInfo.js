import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Solutions from '../components/Solutions';
import Submissions from '../components/Submissions';

const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('testcase');
  const [activeSection, setActiveSection] = useState('code');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  useEffect(() => {
    const handleNavClick = (e) => {
      const target = e.target;
      if (target.classList.contains('nav-tab')) {
        const tabText = target.textContent?.toLowerCase();
        if (tabText === 'solutions') {
          setActiveSection('solutions');
        } else if (tabText === 'submissions') {
          setActiveSection('submissions');
        } else if (tabText === 'code') {
          setActiveSection('code');
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  useEffect(() => {
    const getProblemData = async () => {
      try{
        const response = fetch('http://127.0.0.1:8000/questions/count');
        console.log(response);
      } catch(error){
        console.error("Error fetching problem data:", error);
      }
    };
  getProblemData();
  }
  ,[]);

  return (
    <div className="probleminfo-page">

    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <h1>Question Name</h1>
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab${activeSection === 'code' ? ' active' : ''}`}
                  onClick={() => setActiveSection('code')}>Code</button>
          <button className={`nav-tab${activeSection === 'solutions' ? ' active' : ''}`}
                  onClick={() => setActiveSection('solutions')}>Solutions</button>
          <button className={`nav-tab${activeSection === 'submissions' ? ' active' : ''}`}
                  onClick={() => setActiveSection('submissions')}>Submissions</button>
        </div>
        <div className="nav-actions">
          <button className="submit-btn">Submit</button>
        </div>
      </div>
    </nav>

    <div className = "probleminfo-containers">
      <div className="probleminfo-container">
        <div className="probleminfo-header">
          <h2 className="probleminfo-title">2236. Build User Dashboard</h2>
          <div className="problem-meta">
            <span className="difficulty-badge easy">Easy</span>
            <span className="topic-tag">Frontend</span>
            <span className="topic-tag">React</span>
          </div>
        </div>
        
        <div className="probleminfo-content">
          <p className="probleminfo-description">
            You are given the <span className="code-highlight">requirements</span> for a user dashboard that consists of exactly 
            <span className="code-highlight"> 3</span> main sections: the header, main content area, and sidebar.
          </p>
          
          <p className="probleminfo-description">
            Return a <span className="code-highlight">React component</span> that implements the dashboard layout with proper 
            responsive design, <span className="code-highlight">state management</span>, and user interactions.
          </p>
          
          <div className="example-section">
            <h3 className="example-title">Example 1:</h3>
            <div className="example-content">
              <div className="example-input">
                <strong>Input:</strong> requirements = ["responsive", "dark-theme", "user-profile"]
              </div>
              <div className="example-output">
                <strong>Output:</strong> Dashboard component with responsive layout
              </div>
              <div className="example-explanation">
                <strong>Explanation:</strong> The dashboard should include a responsive header with navigation, 
                a main content area displaying user information, and a collapsible sidebar with menu items.
                The component should handle dark theme switching and display user profile data.
              </div>
            </div>
          </div>
          
          <div className="example-section">
            <h3 className="example-title">Example 2:</h3>
            <div className="example-content">
              <div className="example-input">
                <strong>Input:</strong> requirements = ["analytics", "notifications", "settings"]
              </div>
              <div className="example-output">
                <strong>Output:</strong> Enhanced dashboard with additional features
              </div>
            </div>
          </div>
          
          <div className="constraints-section">
            <h3 className="constraints-title">Constraints:</h3>
            <ul className="constraints-list">
              <li>Component must be responsive (mobile-first approach)</li>
              <li>Use modern React patterns (hooks, functional components)</li>
              <li>Implement proper error handling</li>
              <li>Follow accessibility best practices</li>
              <li>Performance optimized (lazy loading, memoization)</li>
            </ul>
          </div>
        </div>
      </div>


      <div className="editor-container">
        <div className="editor-content">
          {activeSection === 'solutions' && <Solutions />}

          {activeSection === 'submissions' && <Submissions />}

          {activeSection === 'code' && (
            <>
              <div className="code-area">
                <div className="code-header">
                  <div className="code-lang-section">
                    <span className="language-label">Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="language-selector"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                    </select>
                  </div>
                </div>
                <textarea
                  className="code-textarea"
                  defaultValue={`/**\n * Build User Dashboard Component\n * @param {Object} requirements - Dashboard requirements\n * @return {JSX.Element} Dashboard component\n */\n\nimport React, { useState, useEffect } from 'react';\n\nconst UserDashboard = ({ requirements }) => {\n  const [user, setUser] = useState(null);\n  const [theme, setTheme] = useState('dark');\n  \n  useEffect(() => {\n    // Fetch user data\n    fetchUserData();\n  }, []);\n  \n  const fetchUserData = async () => {\n    // Implementation here\n  };\n  \n  return (\n    <div className='dashboard'>\n      {/* Your implementation here */}\n    </div>\n  );\n};\n\nexport default UserDashboard;`}
                />
              </div>

              <div className="editor-footer">
                <div className="editor-tabs">
                  <button
                    className={`editor-tab ${activeTab === 'testcase' ? 'lactive' : ''}`}
                    onClick={() => setActiveTab('testcase')}
                  >
                    ✓ Testcase
                  </button>
                  <button
                    className={`editor-tab ${activeTab === 'result' ? 'lactive' : ''}`}
                    onClick={() => setActiveTab('result')}
                  >
                    📋 Test Result
                  </button>
                </div>

                <div className="test-content">
                  {activeTab === 'testcase' && (
                    <div className="testcase-section">
                      <div className="testcase-header">
                        <span>Case 1</span>
                        <span>Case 2</span>
                        <button className="add-case">+</button>
                      </div>
                      <div className="testcase-input">
                        <label>requirements =</label>
                        <input
                          type="text"
                          defaultValue='["responsive", "dark-theme", "user-profile"]'
                          className="testcase-field"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'result' && (
                    <div className="result-section">
                      <div className="result-status success">
                        <span>✓ All test cases passed</span>
                      </div>
                      <div className="result-details">
                        <p>Runtime: 45ms</p>
                        <p>Memory: 2.1MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="editor-actions">
                  <button className="btn-outline">Run</button>
                  <button className="btn-primary">Submit</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      </div>
    </div>
  );
};

export default CodeEditor;

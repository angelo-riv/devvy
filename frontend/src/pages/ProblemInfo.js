import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import axios from 'axios';
import FileExplorer from '../components/FileExplorer';
import Solutions from '../components/Solutions';
import Submissions from '../components/Submissions';

const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('result');
  const [activeSection, setActiveSection] = useState('code');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [problemData, setProblemData] = useState([]);
  const [result,setResult] = useState([]);
  const [explorerData, setExplorerData] = useState({ files: [], folders: [] });
  const [code, setCode] = useState('');
  const question_id = window.location.pathname.split('/').pop(); 
  const root_folder = question_id;
  const [currentFile, setCurrentFile] = useState('');

  useEffect(() => {
    async function fetchExplorer() {
      const res = await fetch(`http://127.0.0.1:8000/problem-code/${root_folder}`, {
        method: 'POST'
      });
      const data = await res.json();
      setExplorerData(data);
    }
    fetchExplorer();
  }, []);

  const handleFileClick = async (fileUrl) => {
    const res = await fetch(fileUrl);
    const text = await res.text();
    setCurrentFile(fileUrl.split('/').pop().split('?')[0]);
    setCode(text);
  };

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
        const response = await axios.post(`http://127.0.0.1:8000/getProblemDescription/${question_id}`);
        console.log(response);
        setProblemData(response.data);
      } catch(error){
        console.error("Error fetching problem data:", error);
      }
    };
    getProblemData();
  }, [question_id]);

  console.log('explorerData:', explorerData);

  const handleSubmit = async () => {  
  try {
    const username = "testuser";
    const res = await axios.get(`http://127.0.0.1:8000/getProblemId/${question_id}/getUser${username}`);
    const data = res.data;
    setResult(data);
    console.log("hi",result);
    if (!data.submission) {
      console.log("No submission found");
      return;
    }

    if (!data.code) {
      console.log("No code submitted");
      return;
    }

    const base64String = data.code;
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const jszip = new JSZip();
    const zip = await jszip.loadAsync(bytes);
    for (const filename of Object.keys(zip.files)) {
      const content = await zip.files[filename].async("string");
      console.log(`File: ${filename}`, content);
    }
    setActiveTab("result");
    console.log("hi")
  } catch (error) {
    console.error("error", error);
  }
};

  return (
  <div className="probleminfo-page">
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <h1>{problemData.question}</h1>
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab${activeSection === 'code' ? ' active' : ''}`} onClick={() => setActiveSection('code')}>Code</button>
          <button className={`nav-tab${activeSection === 'solutions' ? ' active' : ''}`} onClick={() => setActiveSection('solutions')}>Solutions</button>
          <button className={`nav-tab${activeSection === 'submissions' ? ' active' : ''}`} onClick={() => setActiveSection('submissions')}>Submissions</button>
        </div>
      </div>
    </nav>

    <div className="probleminfo-body" style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      {/* Left: Problem Description */}
      <div className="probleminfo-container" style={{ width: '50%', overflowY: 'auto', padding: '1rem' }}>
        <div className="probleminfo-header">
          <h2 className="probleminfo-title">{problemData.question_id}. {problemData.question}</h2>
          <div className="problem-meta">
            <span className={`difficulty-badge ${problemData.diff}`}>{problemData.diff}</span>
            {problemData.tags?.map((tag, index) => (
              <span key={index} className="topic-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="probleminfo-content">
          <p className="probleminfo-description">
            {problemData.description}
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

      {/* Right: File Explorer + Code Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{ display: 'flex', flex: 1 }}>
          <FileExplorer files={explorerData.files} folders={explorerData.folders} onFileClick={handleFileClick}/>
          <div style={{ flex: 1 }}>
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
                        <div className = "file-title">
                          Current File: <span>{currentFile}</span>
                        </div>
                      </div>
                      <textarea
                        onChange={(e) => setCode(e.target.value)}
                        value={code}
                        className="code-textarea"
                        />
                    </div>

                    <div className="editor-footer">
                      <div className="editor-tabs">
                        <button className={`editor-tab ${activeTab === 'testcase' ? 'lactive' : ''}`} onClick={() => setActiveTab('testcase')}>
                          ✓ Testcase
                        </button>
                        <button className={`editor-tab ${activeTab === 'result' ? 'lactive' : ''}`} onClick={() => setActiveTab('result')}>
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
                          </div>
                        )}
                        {activeTab === 'result' && (
                          <div className="result-section">
                            {result.passed === false && (
                              <>
                              <div className="result-status failed">
                              <span>{result.error}</span>
                            </div>
                            <div className="result-details">
                              <p>Test Cases Passed: {result.passed_cases} of {result.total_cases}</p>
                              <p>Runtime: 45ms</p>
                              <p>Memory: 2.1MB</p>
                            </div>
                            </>
                            )}
                            {result.passed === true && (
                              <>
                              <div className="result-status success">
                              <span>{result.error ?? "All test cases Passed!"}</span>
                            </div>
                            <div className="result-details">
                              <p>Test Cases Passed: {result.passed_cases} of {result.total_cases}</p>
                              <p>Runtime: 45ms</p>
                              <p>Memory: 2.1MB</p>
                            </div>
                            </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="editor-actions">
                        <button className="btn-primary" onClick = {()=> handleSubmit()}>Submit</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default CodeEditor;

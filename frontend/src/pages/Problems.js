// Problems.js
import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [problems, setProblems] = useState([]);

  // ✅ Connect to FastAPI and extract `question` array
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/getQuestions");
        const data = await res.json();
        console.log("Fetched data:", data); // ✅ Debug check
        setProblems(data.question); // ✅ Pull just the question list
      } catch (err) {
        console.error("Failed to load problems:", err);
      }
    };

    fetchProblems();
  }, []);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const tags = ['All', 'Array', 'String', 'Tree', 'Graph', 'Hash Table', 'Dynamic Programming', 'Two Pointers', 'BFS', 'DFS', 'Recursion'];

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'All' || problem.tags.includes(selectedTag);
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  return (
    <div className="problems-page">
      <main className="problems-container">
        <div className="problems-header">
          <h1 className="page-title">Coding Problems</h1>

          <div className="problems-filter-box">
            <div className="filter-grid">
              <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-box"
                />
              </div>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select-box"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="select-box"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="results-bar">
            <p className="results-count">
              Showing {filteredProblems.length} of {problems.length} problems
            </p>
            <button className="post-button">
              Post New Problem
            </button>
          </div>
        </div>
        
        <div className="problems-list">
          {filteredProblems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No problems found</h3>
            <p className="no-results-text">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Problems;

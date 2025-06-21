// Problems.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  const problems = [
    {
      title: "Two Sum with Constraints",
      difficulty: "Medium",
      author: "alex_dev",
      timeAgo: "2 hours ago",
      likes: 24,
      comments: 8,
      tags: ["Array", "Hash Table", "Dynamic Programming"],
      description: "Given an array of integers and a target sum, find two numbers that add up to the target with additional constraints on time complexity."
    },
    {
      title: "Binary Tree Path Traversal",
      difficulty: "Hard",
      author: "sarah_codes",
      timeAgo: "4 hours ago",
      likes: 18,
      comments: 12,
      tags: ["Tree", "Recursion", "DFS"],
      description: "Implement a function to find all root-to-leaf paths in a binary tree that sum to a given target value."
    },
    {
      title: "String Palindrome Checker",
      difficulty: "Easy",
      author: "mike_algorithms",
      timeAgo: "6 hours ago",
      likes: 31,
      comments: 5,
      tags: ["String", "Two Pointers"],
      description: "Create an efficient algorithm to check if a given string is a palindrome, ignoring spaces and case sensitivity."
    },
    {
      title: "Graph Shortest Path",
      difficulty: "Hard",
      author: "emma_graphs",
      timeAgo: "1 day ago",
      likes: 42,
      comments: 15,
      tags: ["Graph", "BFS", "Dijkstra"],
      description: "Implement Dijkstra's algorithm to find the shortest path between two nodes in a weighted graph."
    },
    {
      title: "Array Rotation Challenge",
      difficulty: "Easy",
      author: "john_array",
      timeAgo: "2 days ago",
      likes: 28,
      comments: 7,
      tags: ["Array", "Rotation"],
      description: "Rotate an array to the right by k steps, where k is non-negative. Solve it in-place with O(1) extra space."
    }
  ];

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
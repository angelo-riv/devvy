// Problems.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import axios from 'axios';

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [problemsList, setProblemsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const history = useHistory();
  
  const problems = [
    {
      problem_id: 1,
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
      problem_id: 2,
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
      problem_id: 3,
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
      problem_id: 4,
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
      problem_id: 5,
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
  

  useEffect(() => {
    try {
      const getProblemsData = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/getQuestionsDescription`);
        const data = response.data;
        console.log(data)
        const transformed = data.question_id.map((_, index) => ({
          problem_id: data.question_id[index],
          title: String(data?.question?.[index] ?? ''),
          description: data?.description?.[index] ?? '',
          difficulty: data?.diff?.[index] ?? 'Easy',
          author: "anonymous",  
          timeAgo: "recently", 
          likes: Math.floor(Math.random() * 50), 
          comments: Math.floor(Math.random() * 10), 
          tags: data?.tags?.[index], 
        }));

        const uniqueTags = Array.from(new Set(data.tags.flat()));
        setTagsList(['All', ...uniqueTags]);

        setProblemsList(transformed);
        console.log(tagsList)
      }
      getProblemsData();
    } 
    catch (error) { console.error("Error loading problems data:", error); }
  }, []);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const tags = ['All', 'Array', 'String', 'Tree', 'Graph', 'Hash Table', 'Dynamic Programming', 'Two Pointers', 'BFS', 'DFS', 'Recursion'];

  const filteredProblems = problemsList.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesTag = selectedTag === 'All' || problem.tags.includes(selectedTag);
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const handleClick = (problem) => {
    history.push(`/problemsinfo/${problem.problem_id}`);
  }

  return (
    <div className="problems-page">
      <main className="problems-container">
        <div className="problems-header">
          <h1 className="page-title">Coding Problems</h1>

          <div className="problems-filter-box">
            <div className="filter-grid">
              <div className="problems-search-bar">
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
                  <option className={`difficulty-badge-${difficulty}`}key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="select-box"
              >
                {tagsList.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="results-bar">
            <p className="results-count">
              Showing {filteredProblems.length} of {problemsList.length} problems
            </p>
          </div>
        </div>
        
        <div className="problems-list">
          {filteredProblems.map((problem, index) => (
            <ProblemCard 
            key={index} 
            {...problem}
            onClick ={() => handleClick(problem)} />
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
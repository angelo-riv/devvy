// Home.jsx
import React, {useEffect} from 'react';
import ProblemCard from '../components/ProblemCard';

const Home = () => {
  const [problemCount, setProblemCount] = React.useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/count")
      .then(res => res.json())
      .then(data => setProblemCount(data.count))
      .catch(() => setProblemCount("N/A"));
  }, []);
  const recentProblems = [
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
    }
  ];

  return (
    <div className="homepage">
      <main className="home-main">
        <div className="welcome-section">
          <h1 className="home-title">
            Welcome to <span className="gradient-text">Devvy</span>
          </h1>
          <p className="home-subtitle">
            The professional network for developers. Share coding problems, collaborate on solutions, and grow your programming skills together.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-number-blue" >{problemCount !== null ? problemCount : "..."}</div>
            <div className="stat-label">Active Problems</div>
          </div>
          <div className="stat-card green">
            <div className="stat-number-green">5,892</div>
            <div className="home-stat-label">Solutions Shared</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-number-purple">123</div>
            <div className="stat-label">Active Developers</div>
          </div>
        </div>

        <div className="trending-section">
          <h2 className="trending-title">
            <span>🔥</span>
            <span>Trending Problems</span>
          </h2>
          <div className="problems-list">
            {recentProblems.map((problem, index) => (
              <ProblemCard key={index} {...problem} />
            ))}
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-box">
            <h3 className="cta-title">Ready to Share Your Problem?</h3>
            <p className="cta-subtitle">Join thousands of developers sharing and solving coding challenges together.</p>
            <button className="cta-button">Post a Problem</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
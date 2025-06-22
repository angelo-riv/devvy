// Home.jsx
import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ProblemCard from '../components/ProblemCard';

const Home = () => {
  const [problemCount, setProblemCount] = React.useState(null);
  const [answerCount, setAnswerCount] = React.useState(null);
  const [userCount, setUserCount] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/count")
      .then(res => res.json())
      .then(data => setProblemCount(data.count))
      .catch(() => setProblemCount("N/A"));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/usercount")
      .then(res => res.json())
      .then(data => setUserCount(data.count))
      .catch(() => setUserCount("N/A"));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/answercount")
      .then(res => res.json())
      .then(data => setAnswerCount(data.count))
      .catch(() => setAnswerCount("N/A"));
  }, []);

  const [problemsList, setProblemsList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const history = useHistory();

  useEffect(() => {
    try {
      const getProblemsData = async () => {
        setLoading(true);
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
    catch (error) { 
      console.error("Error loading problems data:", error); 
    } finally {
      setLoading(false);
    }
  }, []);
  const handleClick = (problem) => {
    console.log(problem.problem_id);
    history.push(`/problemsinfo/${problem.problem_id}`);
  }

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
            <div className="stat-number-green">{answerCount !== null ? answerCount : "..."}</div>
            <div className="home-stat-label">Solutions Shared</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-number-purple">{userCount !== null ? userCount : "..."}</div>
            <div className="stat-label">Active Developers</div>
          </div>
        </div>

        <div className="trending-section">
          <h2 className="trending-title">
            <span>🔥</span>
            <span>Trending Problems</span>
          </h2>
          <div className="problems-list">
            {loading ? (
              <div>Loading trending problems...</div>
            ) : (
              problemsList.slice(0,3).map((problem, index) => (
                <ProblemCard key={index} {...problem} onClick = {() => handleClick(problem)}/>
              ))
            )}
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-box">
            <h3 className="cta-title">Ready to Share Your Solution?</h3>
            <p className="cta-subtitle">Join thousands of developers sharing and solving coding challenges together.</p>
            <button className="cta-button" onClick={() => history.push("/problems")}>Solve a Problem</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
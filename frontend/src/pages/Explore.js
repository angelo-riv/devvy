// Explore.jsx
import React from 'react';
import { Calendar, TrendingUp, Users, Code } from 'lucide-react';

const Explore = () => {
  const trendingTopics = [
    { name: "Dynamic Programming", count: 234, growth: "+12%" },
    { name: "Graph Algorithms", count: 189, growth: "+8%" },
    { name: "System Design", count: 156, growth: "+15%" },
    { name: "Machine Learning", count: 143, growth: "+20%" },
    { name: "Binary Trees", count: 112, growth: "+5%" },
  ];

  const featuredCommunities = [
    {
      name: "Algorithm Masters",
      members: "12.3K",
      description: "Advanced algorithmic problem solving and optimization techniques",
      image: "🧠"
    },
    {
      name: "Frontend Challenges",
      members: "8.7K", 
      description: "JavaScript, React, and web development coding challenges",
      image: "💻"
    },
    {
      name: "Data Structures Deep Dive",
      members: "15.1K",
      description: "Comprehensive exploration of data structures and their applications",
      image: "📊"
    },
    {
      name: "Competitive Programming",
      members: "9.4K",
      description: "Contest-style problems and competitive programming strategies",
      image: "🏆"
    }
  ];

  const weeklyStats = [
    { label: "New Problems", value: "247", icon: Code },
    { label: "Active Users", value: "12.3K", icon: Users },
    { label: "Solutions Shared", value: "1.8K", icon: TrendingUp },
    { label: "Events This Week", value: "8", icon: Calendar },
  ];

  return (
    <div className="explore-container">
      <main className="explore-main">
        <div className="explore-header">
          <h1 className="explore-title">Explore</h1>
          <p className="explore-subtitle">Discover trending topics, communities, and insights in the coding world</p>
        </div>

        <div className="stats-section">
          {weeklyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-box">
                <div className="stat-box-header">
                  <Icon className="stat-icon" size={24} />
                  <span className="stat-value">{stat.value}</span>
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid-two-cols">
          <div className="topic-box">
            <h2 className="section-heading">
              <TrendingUp className="topic-icon" size={24} />
              <span>Trending Topics</span>
            </h2>
            <div className="topic-list">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <div>
                    <h3 className="topic-name">{topic.name}</h3>
                    <p className="topic-meta">{topic.count} discussions</p>
                  </div>
                  <span className="topic-growth">{topic.growth}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="community-box">
            <h2 className="section-heading">
              <Users className="community-icon" size={24} />
              <span>Featured Communities</span>
            </h2>
            <div className="community-list">
              {featuredCommunities.map((community, index) => (
                <div key={index} className="community-item">
                  <div className="community-header">
                    <div className="community-img">{community.image}</div>
                    <div className="community-details">
                      <div className="community-meta">
                        <h3 className="community-name">{community.name}</h3>
                        <span className="community-members">{community.members} members</span>
                      </div>
                      <p className="community-desc">{community.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="discovery-section">
          <h2 className="discover-title">Discover New Challenges</h2>
          <div className="discover-grid">
            <div className="discover-card daily">
              <h3 className="discover-heading">Daily Challenge</h3>
              <p className="discover-sub">Solve today's featured problem and climb the leaderboard!</p>
              <button className="discover-btn blue">Start Challenge</button>
            </div>
            <div className="discover-card study">
              <h3 className="discover-heading">Study Path</h3>
              <p className="discover-sub">Follow curated learning paths to master specific topics.</p>
              <button className="discover-btn green">Browse Paths</button>
            </div>
            <div className="discover-card mock">
              <h3 className="discover-heading">Mock Interviews</h3>
              <p className="discover-sub">Practice with 100+ realistic interview-style coding problems.</p>
              <button className="discover-btn purple">Start Practice</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
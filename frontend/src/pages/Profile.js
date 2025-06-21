// Profile.js
import { Calendar, Code, Trophy, Users, GitBranch, Star, MessageCircle } from 'lucide-react';

const Profile = () => {
  const userStats = [
    { label: "Problems Solved", value: "147", icon: Code, color: "blue" },
    { label: "Contest Wins", value: "12", icon: Trophy, color: "yellow" },
    { label: "Followers", value: "1.2K", icon: Users, color: "green" },
    { label: "Contributions", value: "89", icon: GitBranch, color: "purple" },
  ];

  const recentActivity = [
    { type: "solved", title: "Binary Tree Maximum Path Sum", time: "2 hours ago", difficulty: "Hard", icon: Code },
    { type: "posted", title: "Two Pointer Technique in Sliding Window", time: "1 day ago", difficulty: "Medium", icon: MessageCircle },
    { type: "won", title: "Weekly Algorithm Contest #47", time: "3 days ago", difficulty: "Contest", icon: Trophy },
    { type: "solved", title: "Longest Increasing Subsequence", time: "5 days ago", difficulty: "Medium", icon: Code }
  ];

  const skillsData = [
    { name: "Dynamic Programming", level: 85, problems: 23 },
    { name: "Graph Algorithms", level: 78, problems: 19 },
    { name: "Tree Traversal", level: 92, problems: 31 },
    { name: "Array Manipulation", level: 88, problems: 42 },
    { name: "String Processing", level: 74, problems: 16 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'yellow'; 
      case 'Hard': return 'red';
      case 'Contest': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="profile-container">
      <main className="main-content">
        <div className="profile-header">
          <div className="profile-avatar">JD</div>
          <div className="profile-details">
            <h1 className="profile-name">John Developer</h1>
            <p className="profile-title">Senior Software Engineer @TechCorp | Algorithm Enthusiast</p>
            <div className="profile-meta">
              <span><Calendar size={14} /> Joined March 2023</span>
              <span><Star size={14} /> 4.8 rating</span>
              <span>📍 San Francisco, CA</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn message-btn">Message</button>
            <button className="btn follow-btn">Follow</button>
          </div>
        </div>

        <div className="stats-grid">
          {userStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <Icon className={`stat-icon ${stat.color}`} size={32} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="content-grid">
          <div className="skills-activity">
            <div className="skills-section">
              <h2>Skills & Progress</h2>
              {skillsData.map((skill, index) => (
                <div key={index} className="skill-bar-wrapper">
                  <div className="skill-header">
                    <span>{skill.name}</span>
                    <span>{skill.problems} problems</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                  <div className="skill-percent">{skill.level}%</div>
                </div>
              ))}
            </div>

            <div className="activity-section">
              <h2>Recent Activity</h2>
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="activity-card">
                    <Icon className="activity-icon" size={20} />
                    <div>
                      <h3>{activity.title}</h3>
                      <div className="activity-meta">
                        <span>{activity.time}</span>
                        <span className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar">
            <div className="achievements-section">
              <h2>Achievements</h2>
              <div className="achievement">🥇 Contest Champion <small>Won 10+ contests</small></div>
              <div className="achievement">🔥 30-Day Streak <small>Solved daily problems</small></div>
              <div className="achievement">💡 Problem Setter <small>Created 50+ problems</small></div>
            </div>

            <div className="contributions-section">
              <h2>Contribution Graph</h2>
              <p>147 contributions in the last year</p>
              <div className="contribution-graph">
                {Array.from({ length: 49 }, (_, i) => (
                  <div key={i} className={`contribution-cell`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

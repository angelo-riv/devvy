import { Calendar, Clock, Users, Trophy } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Best MERN Stack Developer Contest",
      date: "2024-06-22",
      time: "3:00 PM EST",
      duration: "2 hours",
      participants: 1247,
      type: "Contest",
      description: "Compete with developers worldwide to build the best MERN stack application. Showcase your skills and creativity.",
      difficulty: "",
      tags: ["Monthly", "Contest", "MERN", "MongoDB", "Express", "React", "Node.js"]
    },
    {
      id: 2,
      title: "AWS Solution Architecture Challenge",
      date: "2024-06-24",
      time: "7:00 PM EST", 
      duration: "1.5 hours",
      participants: 432,
      type: "Company Event",
      description: "Take on an AWS architecture challenge made by Amazon Engineering Managers. Design scalable and efficient solutions using AWS services.",
      difficulty: "Hosted By Amazon",
      tags: ["System Design", "Architecture", "AWS", "Cloud Computing"]
    },
    {
      id: 3,
      title: "Best Website built with Three.js",
      date: "2024-06-25",
      time: "6:00 PM EST",
      duration: "2 hours", 
      participants: 867,
      type: "Contest",
      description: "Join the contest to create the most innovative and visually stunning website using Three.js. Showcase your creativity and technical skills.",
      difficulty: "",
      tags: ["Frontend", "Three.js", "Blender", "React"]
    },
    {
      id: 4,
      title: "Kafka and Apache Flink Message Processing Event",
      date: "2024-06-26",
      time: "4:00 PM EST",
      duration: "3 hours",
      participants: 234,
      type: "Company Event",
      description: "Take part in competing to build a real-time message processing application using Kafka and Apache Flink.",
      difficulty: "Hosted by Netflix",
      tags: ["Limited Time", "Kafka", "Apache Flink"]
    }
  ];

  return (
    <div className="events-container">
      <main className="events-main">
        <div className="events-header">
          <h1>Events</h1>
          <p>Join contests, workshops, and study groups to level up your coding skills</p>
        </div>

        <div className="event-stats-grid">
          <div className="event-stat">
            <Trophy className="event-icon yellow" size={32} />
            <div className="stat-value">8</div>
            <p>Active Contests</p>
          </div>
          <div className="event-stat">
            <Users className="event-icon blue" size={32} />
            <div className="stat-value">2.1K</div>
            <p>Participants Today</p>
          </div>
          <div className="event-stat">
            <Calendar className="event-icon green" size={32} />
            <div className="stat-value">15</div>
            <p>Events This Week</p>
          </div>
          <div className="event-stat">
            <Clock className="event-icon purple" size={32} />
            <div className="stat-value">24h</div>
            <p>Until Next Contest</p>
          </div>
        </div>

        <div className="events-subheader">
          <h2>Upcoming Events</h2>
        </div>

        <div className="event-list">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-header">
                <div>
                  <div className="event-title-row">
                    <h3>{event.title}</h3>
                    <span className={`event-type ${event.type.toLowerCase().replace(/ /g, '-')}`}>{event.type}</span>
                  </div>
                  <div className="event-meta">
                    <span><Calendar size={14} /> {event.date}</span>
                    <span><Clock size={14} /> {event.time} ({event.duration})</span>
                    <span><Users size={14} /> {event.participants} registered</span>
                    <span className={`event-difficulty ${event.difficulty.toLowerCase().replace(/ /g, '-')}`}>{event.difficulty}</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="event-btn gray">Learn More</button>
                  <button className="event-btn blue">Register</button>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="event-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="featured-section">
          <h2>Featured Event</h2>
          <div className="featured-card">
            <div className="featured-left">
              <h3>Devvy Annual Championship</h3>
              <p>
                Join the biggest coding competition of the year! Compete for the ultimate title and amazing prizes.
                Three rounds of increasingly challenging problems await.
              </p>
              <div className="featured-meta">
                <span><Calendar size={20} /> July 15-17, 2024</span>
                <span><Users size={20} /> 10,000+ participants</span>
              </div>
              <button className="event-btn white-purple">Register Now</button>
            </div>
            <div className="featured-right">
              <div className="featured-icon">🏆</div>
              <div className="featured-prize">$50,000</div>
              <div className="featured-sub">Total Prize Pool</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;
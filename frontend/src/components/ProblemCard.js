import { Calendar, User, ThumbsUp, MessageCircle } from 'lucide-react';

const ProblemCard = ({ title, difficulty, author, timeAgo, likes, comments, tags, description }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'easy';
      case 'Medium': return 'medium';
      case 'Hard': return 'hard';
      default: return 'unknown';
    }
  };

  return (
    <div className="problem-card">
      <div className="problem-header">
        <div className="problem-info">
          <h3 className="problem-title">{title}</h3>
          <div className="problem-meta">
            <div className="meta-item">
              <User size={14} />
              <span>{author}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <span className={`difficulty-badge ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
      </div>

      <p className="problem-description">{description}</p>

      <div className="problem-footer">
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

        <div className="interactions">
          <div className="interaction hover-green">
            <ThumbsUp size={16} />
            <span>{likes}</span>
          </div>
          <div className="interaction hover-blue">
            <MessageCircle size={16} />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
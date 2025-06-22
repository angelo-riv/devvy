import { Calendar, User, ThumbsUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProblemCard = ({ onClick, problem_id, title, difficulty, author, timeAgo, likes, comments, tags, description, index }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'unknown';
    }
  };

  return (
    <div className="problem-card" onClick={onClick}>
      <div className="problem-header">
        <div className="problem-info">
          <h3 className="problem-title">{problem_id}. {title}</h3>
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
// components/courses/CourseCard.jsx — Reusable course card component
import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  'Web Development': 'badge-purple',
  'Data Science': 'badge-teal',
  'AI/ML': 'badge-amber',
  'Cybersecurity': 'badge-red',
  'Mobile Development': 'badge-purple',
  'Cloud Computing': 'badge-teal',
  'DevOps': 'badge-amber',
  'UI/UX Design': 'badge-red',
  'Database': 'badge-teal',
  'Programming': 'badge-purple',
};

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span className="stars">
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span style={{ color: 'var(--text-secondary)', marginLeft: 4, fontSize: 12 }}>
        {Number(rating).toFixed(1)}
      </span>
    </span>
  );
};

const CourseCard = ({ course, enrolled = false, progress = 0, showScore = false }) => {
  if (!course) return null;
  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', cursor: 'pointer' }}>
        {/* Thumbnail / Icon area */}
        <div style={{
          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
          height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} style={{ width: 64, height: 64, objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: 48 }}>📚</span>
          )}
          {enrolled && (
            <div style={{
              position: 'absolute', top: 8, right: 8,
              background: 'var(--accent-secondary)', color: '#000',
              fontSize: 10, fontWeight: 700, padding: '2px 8px',
              borderRadius: 20,
            }}>ENROLLED</div>
          )}
          {showScore && course.recommendScore > 0 && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: 'rgba(108,99,255,0.9)', color: '#fff',
              fontSize: 10, fontWeight: 700, padding: '2px 8px',
              borderRadius: 20,
            }}>⚡ {course.recommendScore}% match</div>
          )}
        </div>

        {/* Category badge + level */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className={`badge ${CATEGORY_COLORS[course.category] || 'badge-purple'}`}>
            {course.category}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
          {course.title}
        </h3>

        {/* Instructor */}
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          by {course.instructor}
        </p>

        {/* Progress bar (only if enrolled) */}
        {enrolled && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ fontSize: 11, color: 'var(--accent-secondary)', fontWeight: 600 }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <StarRating rating={course.rating || 4} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {course.duration || '—'}
          </span>
        </div>

        {/* Price */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-secondary)', fontSize: 15 }}>
          {course.price === 0 ? '🆓 Free' : `₹${course.price}`}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

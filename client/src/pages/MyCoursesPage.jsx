// pages/MyCoursesPage.jsx — User's enrolled courses with progress tracking
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, progressAPI } from '../services/api';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, progressRes] = await Promise.all([
          enrollmentAPI.getMyEnrollments(),
          progressAPI.getAll(),
        ]);
        setEnrollments(enrollRes.data.data);
        const pm = {};
        progressRes.data.data.forEach((p) => {
          pm[p.course?._id] = { percent: p.progressPercent, completed: p.completed };
        });
        setProgressMap(pm);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = enrollments.filter((e) => {
    if (filter === 'completed') return progressMap[e.course?._id]?.completed;
    if (filter === 'in-progress') return !progressMap[e.course?._id]?.completed;
    return true;
  });

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>My Courses</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{enrollments.length} enrolled courses</p>
          </div>
          <Link to="/courses" className="btn btn-primary btn-sm">+ Enroll More</Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              style={{
                padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: `1px solid ${filter === key ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                background: filter === key ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: filter === key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No courses here yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              {enrollments.length === 0
                ? 'Start your learning journey today!'
                : 'No courses match this filter.'}
            </p>
            {enrollments.length === 0 && (
              <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((e) => {
              const course = e.course;
              if (!course) return null;
              const prog = progressMap[course._id] || { percent: 0, completed: false };
              return (
                <Link
                  key={e._id}
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 80, height: 80, borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {course.thumbnail
                        ? <img src={course.thumbnail} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                        : <span style={{ fontSize: 32 }}>📚</span>}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                          background: 'rgba(108,99,255,0.15)', color: 'var(--accent-primary)',
                        }}>{course.category}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{course.level}</span>
                        {prog.completed && (
                          <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: 'rgba(0,212,170,0.15)', color: 'var(--accent-secondary)' }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {course.title}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                        by {course.instructor} · {course.totalLessons} lessons · {course.duration}
                      </p>

                      {/* Progress */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-secondary)' }}>{prog.percent}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${prog.percent}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div style={{ flexShrink: 0 }}>
                      <span className="btn btn-primary btn-sm">
                        {prog.percent > 0 ? 'Continue →' : 'Start →'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;

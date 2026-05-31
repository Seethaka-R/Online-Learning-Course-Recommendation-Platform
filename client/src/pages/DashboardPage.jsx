// pages/DashboardPage.js — Learner dashboard with stats, recommendations, progress
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, progressAPI, recommendAPI } from '../services/api';
import CourseCard from '../components/courses/CourseCard';

const StatCard = ({ label, value, color }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, progressRes, recRes] = await Promise.all([
          enrollmentAPI.getMyEnrollments(),
          progressAPI.getAll(),
          recommendAPI.get(),
        ]);
        setEnrollments(enrollRes.data.data);
        // Build progress map: courseId → progressPercent
        const pm = {};
        progressRes.data.data.forEach((p) => { pm[p.course?._id] = p.progressPercent; });
        setProgressMap(pm);
        setRecommendations(recRes.data.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const completedCount = Object.values(progressMap).filter((p) => p >= 100).length;
  const avgProgress = enrollments.length
    ? Math.round(Object.values(progressMap).reduce((a, b) => a + b, 0) / enrollments.length)
    : 0;

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28 }}>
            Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
            {user?.experienceLevel} learner · Interests: {user?.interests?.join(', ') || 'Not set'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard label="Enrolled Courses" value={enrollments.length} color="var(--accent-primary)" />
          <StatCard label="Completed" value={completedCount} color="var(--accent-secondary)" />
          <StatCard label="Avg Progress" value={`${avgProgress}%`} color="var(--accent-amber)" />
          <StatCard label="Skills" value={user?.skills?.length || 0} color="var(--accent-red)" />
        </div>

        {/* Continue learning */}
        {enrollments.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20 }}>Continue Learning</h2>
              <Link to="/my-courses" style={{ fontSize: 13, color: 'var(--accent-primary)' }}>View all →</Link>
            </div>
            <div className="course-grid">
              {enrollments.slice(0, 4).map((e) => (
                <CourseCard
                  key={e._id}
                  course={e.course}
                  enrolled
                  progress={progressMap[e.course?._id] || 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 20 }}>⚡ Recommended for You</h2>
              <Link to="/courses" style={{ fontSize: 13, color: 'var(--accent-primary)' }}>Explore more →</Link>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Based on your interests in {user?.interests?.slice(0, 2).join(' & ')}
            </p>
            <div className="course-grid">
              {recommendations.map((c) => (
                <CourseCard key={c._id} course={c} showScore />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {enrollments.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Start your learning journey</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Explore courses tailored to your interests</p>
            <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
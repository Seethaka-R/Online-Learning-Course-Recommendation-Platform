// pages/HomePage.js — Landing page for non-logged-in users
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseCard from '../components/courses/CourseCard';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    courseAPI.getFeatured().then(({ data }) => setFeatured(data.data)).catch(console.error);
  }, []);

  const stats = [
    { label: 'Courses', value: '20+' },
    { label: 'Learners', value: '50K+' },
    { label: 'Categories', value: '10' },
    { label: 'Instructors', value: '15+' },
  ];

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '80px 0 60px',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <span className="badge badge-purple" style={{ fontSize: 12 }}>⚡ AI-Powered Recommendations</span>
          </div>
          <h1 style={{ fontSize: 52, lineHeight: 1.1, marginBottom: 20, maxWidth: 720, margin: '0 auto 20px' }}>
            Learn Skills That{' '}
            <span style={{ color: 'var(--accent-primary)' }}>Actually</span> Matter
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 540, margin: '0 auto 32px' }}>
            Personalized course recommendations based on your interests, skills, and learning goals.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Learning Free →</Link>
            <Link to="/courses" className="btn btn-secondary btn-lg">Browse Courses</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 52, flexWrap: 'wrap' }}>
            {stats.map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-secondary)' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '60px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <h2 style={{ fontSize: 26, textAlign: 'center', marginBottom: 40 }}>How LearnHub Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Create Profile', desc: 'Tell us your skills and interests', icon: '👤' },
              { step: '02', title: 'Get Recommendations', desc: 'AI matches courses to your goals', icon: '⚡' },
              { step: '03', title: 'Enroll & Learn', desc: 'Start learning at your own pace', icon: '📚' },
              { step: '04', title: 'Track Progress', desc: 'Monitor your learning journey', icon: '📈' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>{step}</div>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured courses */}
      {featured.length > 0 && (
        <div style={{ padding: '60px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 24 }}>Featured Courses</h2>
              <Link to="/courses" style={{ fontSize: 13, color: 'var(--accent-primary)' }}>View all →</Link>
            </div>
            <div className="course-grid">
              {featured.map((c) => <CourseCard key={c._id} course={c} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
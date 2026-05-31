// pages/HomePage.jsx — Landing page with hero, features, and CTA
import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🎯', title: 'Personalized Recommendations', desc: 'AI-powered course suggestions based on your interests, skills, and learning goals.' },
  { icon: '📊', title: 'Track Your Progress', desc: 'Monitor completion, get stats on your learning journey, and celebrate milestones.' },
  { icon: '🚀', title: '20+ Premium Courses', desc: 'From Web Development to AI/ML — curated courses across 10 tech categories.' },
  { icon: '🏆', title: 'Learn From Experts', desc: 'Courses taught by industry professionals and top educators.' },
];

const CATEGORIES = [
  { icon: '⚛️', name: 'Web Development', color: '#6c63ff' },
  { icon: '📊', name: 'Data Science', color: '#00d4aa' },
  { icon: '🤖', name: 'AI/ML', color: '#ffb347' },
  { icon: '🔐', name: 'Cybersecurity', color: '#ff6b6b' },
  { icon: '📱', name: 'Mobile Development', color: '#6c63ff' },
  { icon: '☁️', name: 'Cloud Computing', color: '#00d4aa' },
  { icon: '🐳', name: 'DevOps', color: '#ffb347' },
  { icon: '🎨', name: 'UI/UX Design', color: '#ff6b6b' },
];

const HomePage = () => {
  return (
    <div className="page-fade">
      {/* ── Hero ── */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(108,99,255,0.12) 0%, transparent 60%)',
        padding: '60px 0',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 20,
            background: 'rgba(108,99,255,0.15)', color: 'var(--accent-primary)',
            fontSize: 13, fontWeight: 600, marginBottom: 24,
          }}>
            🎓 AI-Powered Learning Platform
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, marginBottom: 24 }}>
            Learn Smarter with{' '}
            <span style={{ color: 'var(--accent-primary)' }}>Personalized</span>{' '}
            Course Recommendations
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            LearnHub analyzes your skills and interests to recommend the perfect courses — 
            helping you learn faster and smarter.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
              Get Started Free 🚀
            </Link>
            <Link to="/courses" className="btn btn-secondary btn-lg" style={{ fontSize: 16 }}>
              Explore Courses →
            </Link>
          </div>

          {/* Stats strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48,
            marginTop: 60, flexWrap: 'wrap',
          }}>
            {[['20+', 'Expert Courses'], ['10', 'Categories'], ['100K+', 'Students'], ['4.7★', 'Avg Rating']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>{num}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>Browse by Category</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
            10 tech domains, curated for modern learners
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16,
          }}>
            {CATEGORIES.map(({ icon, name, color }) => (
              <Link key={name} to={`/courses?category=${encodeURIComponent(name)}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: 20, transition: 'all 0.25s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <span style={{ fontSize: 32 }}>{icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, marginTop: 10, color: 'var(--text-primary)' }}>{name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        padding: '80px 0',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container">
          <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>Why LearnHub?</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
            Built for serious learners who want results
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 36 }}>{icon}</span>
                <h3 style={{ fontSize: 17 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>
            Ready to start your{' '}
            <span style={{ color: 'var(--accent-primary)' }}>learning journey</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }}>
            Join thousands of learners. Get personalized course recommendations today.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
            Start Learning for Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
      }}>
        <p>© 2024 LearnHub · Online Learning & Course Recommendation Platform</p>
      </footer>
    </div>
  );
};

export default HomePage;

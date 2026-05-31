// pages/RegisterPage.jsx — User registration with skills/interests
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INTERESTS = [
  'Web Development', 'Data Science', 'AI/ML', 'Cybersecurity',
  'Mobile Development', 'Cloud Computing', 'DevOps', 'UI/UX Design',
  'Database', 'Programming',
];

const SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
  'Java', 'C++', 'TypeScript', 'Flutter', 'Docker',
];

const Pill = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: '5px 12px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      border: `1px solid ${selected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
      background: selected ? 'rgba(108,99,255,0.15)' : 'transparent',
      color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </button>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    interests: [],
    skills: [],
    experienceLevel: 'beginner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 28 }}>
            <span style={{ color: 'var(--accent-primary)' }}>Learn</span>Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {step === 1 ? 'Create your account to start learning' : 'Personalize your experience'}
          </p>
          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{
                width: 28, height: 4, borderRadius: 2,
                background: s <= step ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 1 ? (
              <>
                <h2 style={{ fontSize: 18, marginBottom: 4 }}>Account Details</h2>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                {error && <p style={{ color: 'var(--accent-red)', fontSize: 13 }}>{error}</p>}
                <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 4 }}>
                  Continue →
                </button>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 18, marginBottom: 4 }}>Personalize Learning</h2>

                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Experience Level</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['beginner', 'intermediate', 'advanced'].map((l) => (
                      <Pill
                        key={l}
                        label={l.charAt(0).toUpperCase() + l.slice(1)}
                        selected={form.experienceLevel === l}
                        onClick={() => setForm({ ...form, experienceLevel: l })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Interests (select all that apply)</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {INTERESTS.map((i) => (
                      <Pill key={i} label={i} selected={form.interests.includes(i)} onClick={() => toggle('interests', i)} />
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Skills you know</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SKILLS.map((s) => (
                      <Pill key={s} label={s} selected={form.skills.includes(s)} onClick={() => toggle('skills', s)} />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2 }}
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account 🚀'}
                  </button>
                </div>
              </>
            )}

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

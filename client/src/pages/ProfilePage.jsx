// pages/ProfilePage.js — Update interests, skills, and profile info
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const INTERESTS = ['Web Development','Data Science','AI/ML','Cybersecurity','Mobile Development','Cloud Computing','DevOps','UI/UX Design','Database','Programming'];
const SKILLS    = ['JavaScript','Python','React','Node.js','SQL','Java','C++','TypeScript','Flutter','Docker'];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    experienceLevel: user?.experienceLevel || 'beginner',
  });
  const [saving, setSaving] = useState(false);

  const toggle = (field, value) =>
    setForm((f) => ({ ...f, [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value] }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (e) { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const Pill = ({ label, selected, onClick }) => (
    <button onClick={onClick} type="button" style={{
      padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
      border: `1px solid ${selected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
      background: selected ? 'rgba(108,99,255,0.15)' : 'transparent',
      color: selected ? 'var(--accent-primary)' : 'var(--text-secondary)',
      cursor: 'pointer',
    }}>{label}</button>
  );

  return (
    <div className="page-wrapper page-fade">
      <div className="container" style={{ maxWidth: 680 }}>
        <h1 style={{ fontSize: 26, marginBottom: 28 }}>Edit Profile</h1>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Basic info */}
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Basic Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell us about yourself..." style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Experience Level</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['beginner','intermediate','advanced'].map((l) => (
                    <Pill key={l} label={l.charAt(0).toUpperCase()+l.slice(1)} selected={form.experienceLevel===l} onClick={() => setForm({ ...form, experienceLevel: l })} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Interests</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Used to personalise your course recommendations</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS.map((i) => <Pill key={i} label={i} selected={form.interests.includes(i)} onClick={() => toggle('interests', i)} />)}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Skills</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Your current technical skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS.map((s) => <Pill key={s} label={s} selected={form.skills.includes(s)} onClick={() => toggle('skills', s)} />)}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
// pages/MyCoursesPage.js — Enrolled courses with progress update UI
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, progressAPI } from '../services/api';
import { toast } from 'react-toastify';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrollRes, progressRes] = await Promise.all([
          enrollmentAPI.getMyEnrollments(),
          progressAPI.getAll(),
        ]);
        setEnrollments(enrollRes.data.data);
        const pm = {};
        progressRes.data.data.forEach((p) => { pm[p.course?._id] = p.progressPercent; });
        setProgressMap(pm);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleProgressUpdate = async (courseId, value) => {
    setUpdating(courseId);
    try {
      await progressAPI.update(courseId, { progressPercent: Number(value) });
      setProgressMap((pm) => ({ ...pm, [courseId]: Number(value) }));
      if (Number(value) >= 100) toast.success('🎉 Course completed!');
      else toast.success('Progress updated!');
    } catch (e) { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>My Courses</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          {enrollments.length} enrolled course{enrollments.length !== 1 ? 's' : ''}
        </p>

        {enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
            <h3 style={{ marginBottom: 8 }}>No courses yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Start learning today!</p>
            <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {enrollments.map(({ _id, course, enrolledAt }) => {
              if (!course) return null;
              const pct = progressMap[course._id] || 0;
              const completed = pct >= 100;
              return (
                <div key={_id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: 80, height: 80, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: 44, height: 44 }} /> : <span style={{ fontSize: 32 }}>📖</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/courses/${course._id}`} style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 4 }}>
                      {course.title}
                    </Link>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                      {course.category} · {course.level} · Enrolled {new Date(enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: completed ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>
                          {completed ? '✓ Completed' : `${pct}%`}
                        </span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    </div>

                    {/* Progress slider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Update progress:</span>
                      <input
                        type="range" min="0" max="100" step="5" value={pct}
                        onChange={(e) => setProgressMap((pm) => ({ ...pm, [course._id]: Number(e.target.value) }))}
                        style={{ flex: 1, width: 'auto', padding: 0, background: 'transparent', border: 'none' }}
                      />
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleProgressUpdate(course._id, pct)}
                        disabled={updating === course._id}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {updating === course._id ? '...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
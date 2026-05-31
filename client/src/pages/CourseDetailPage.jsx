// pages/CourseDetailPage.js — Course info, enroll button, curriculum
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await courseAPI.getById(id);
        setCourse(data.data);
        if (user) {
          const { data: enrollData } = await enrollmentAPI.checkEnrollment(id);
          setEnrolled(enrollData.enrolled);
          if (enrollData.enrolled) {
            const { data: progData } = await progressAPI.getByCourse(id);
            setProgress(progData.data);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(id);
      setEnrolled(true);
      toast.success(`Enrolled in "${course.title}"!`);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!course) return <div style={{ padding: 40, textAlign: 'center' }}>Course not found</div>;

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Left — course info */}
          <div>
            <span className={`badge badge-purple`} style={{ marginBottom: 12, display: 'inline-block' }}>{course.category}</span>
            <h1 style={{ fontSize: 30, lineHeight: 1.25, marginBottom: 16 }}>{course.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{course.description}</p>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 28, fontSize: 14, color: 'var(--text-secondary)' }}>
              <span>⭐ {course.rating?.toFixed(1)} rating</span>
              <span>👥 {course.enrolledCount?.toLocaleString()} students</span>
              <span>⏱️ {course.duration}</span>
              <span>📚 {course.totalLessons} lessons</span>
              <span>🎯 {course.level}</span>
            </div>

            <p style={{ marginBottom: 24 }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Instructor: </strong>
              <span>{course.instructor}</span>
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
              {course.tags?.map((t) => (
                <span key={t} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 12,
                  background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}>{t}</span>
              ))}
            </div>

            {/* Progress (if enrolled) */}
            {enrolled && progress && (
              <div className="card" style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>Your Progress</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completion</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-secondary)' }}>{progress.progressPercent}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress.progressPercent}%` }} /></div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  {progress.completedLessons?.length} / {course.totalLessons} lessons completed
                </p>
              </div>
            )}

            {/* Curriculum */}
            {course.curriculum?.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>Curriculum</h2>
                {course.curriculum.map((section, i) => (
                  <div key={i} className="card" style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{section.sectionTitle}</h3>
                    {section.lessons?.map((lesson, j) => (
                      <div key={j} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '7px 0',
                        borderBottom: j < section.lessons.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        fontSize: 13, color: 'var(--text-secondary)',
                      }}>
                        <span>▶ {lesson.lessonTitle}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — enroll card (sticky) */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div className="card">
              <div style={{
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                {course.thumbnail ? <img src={course.thumbnail} alt="" style={{ width: 80, height: 80 }} /> : <span style={{ fontSize: 56 }}>📚</span>}
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: 16 }}>
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </div>

              {enrolled ? (
                <div>
                  <div style={{ padding: 10, background: 'rgba(0,212,170,0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: 12, color: 'var(--accent-secondary)', fontWeight: 600, fontSize: 14 }}>
                    ✓ You are enrolled
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/my-courses')}>
                    Go to My Courses →
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
              )}

              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>✓ Lifetime access</span>
                <span>✓ {course.totalLessons} lessons</span>
                <span>✓ Certificate on completion</span>
                <span>✓ {course.duration} total content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
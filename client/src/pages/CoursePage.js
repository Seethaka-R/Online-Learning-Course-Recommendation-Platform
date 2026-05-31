// pages/CoursesPage.js — Browse, search, and filter all courses
import React, { useEffect, useState, useCallback } from 'react';
import { courseAPI } from '../services/api';
import CourseCard from '../components/courses/CourseCard';

const CATEGORIES = ['All','Web Development','Data Science','AI/ML','Cybersecurity','Mobile Development','Cloud Computing','DevOps','UI/UX Design','Database','Programming'];
const LEVELS     = ['All','beginner','intermediate','advanced'];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [page, setPage] = useState(1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;
      const { data } = await courseAPI.getAll(params);
      setCourses(data.data);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, level, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Explore Courses</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{total} courses available</p>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          <input
            placeholder="🔍  Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: '1 1 260px', minWidth: 200 }}
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={{ flex: '0 0 auto', width: 'auto' }}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }} style={{ flex: '0 0 auto', width: 'auto' }}>
            {LEVELS.map((l) => <option key={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }} style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
              border: `1px solid ${category === c ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
              background: category === c ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: category === c ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>

        {/* Course grid */}
        {loading ? (
          <div className="spinner" />
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>No courses found. Try a different search or filter.</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ padding: '6px 12px', color: 'var(--text-secondary)', fontSize: 13 }}>
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <button className="btn btn-secondary btn-sm" disabled={courses.length < 12} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
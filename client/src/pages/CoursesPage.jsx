// pages/CoursesPage.jsx — Course catalog with search, filter, and pagination
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseAPI } from '../services/api';
import CourseCard from '../components/courses/CourseCard';

const CATEGORIES = [
  'All', 'Web Development', 'Data Science', 'AI/ML', 'Cybersecurity',
  'Mobile Development', 'Cloud Computing', 'DevOps', 'UI/UX Design',
  'Database', 'Programming',
];
const LEVELS = ['All', 'beginner', 'intermediate', 'advanced'];

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'All';
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(categoryParam);
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
      setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <div className="page-wrapper page-fade">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Explore Courses</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {total > 0 ? `${total} courses available` : 'Browse all available courses'}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search courses, topics, instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            🔍 Search
          </button>
        </form>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setCategory(cat); setPage(1); }}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                border: `1px solid ${category === cat ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                background: category === cat ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: category === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLevel(l); setPage(1); }}
              style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                border: `1px solid ${level === l ? 'var(--accent-secondary)' : 'var(--border-medium)'}`,
                background: level === l ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: level === l ? 'var(--accent-secondary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner" />
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <h3 style={{ marginBottom: 8 }}>No courses found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try a different search or category</p>
          </div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >← Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

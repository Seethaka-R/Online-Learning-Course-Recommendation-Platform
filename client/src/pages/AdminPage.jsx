import React, { useState } from 'react';
import { courseAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await courseAPI.create({ title, description });
      toast.success('Course created');
      setTitle(''); setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Admin — Create Course</h2>
      <form onSubmit={submit} style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={6} />
        </div>
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
}

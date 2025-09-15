import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function CategorySelect({ type, value, onChange, allowCreate = true }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');

  const listUrl = `/api/v1/categories?type=${type}`;
  const createUrl = `/api/v1/categories`;

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(listUrl);
        if (ok) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Load categories failed:', e?.response?.data || e.message);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, [listUrl]);

  async function createCategory(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      const { data } = await axiosInstance.post(createUrl, { type, name });
      setItems(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)));
      onChange?.(data._id, data.name);
      setNewName('');
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Create category failed';
      alert(msg);
      console.error('Create category failed:', e);
    }
  }

  if (loading) return <div className="input input-disabled">Loading categories…</div>;

  return (
    <div className="space-y-2">
      <select
        className="input"
        value={value || ''}
        onChange={(e) => {
          const id   = e.target.value || '';
          const name = id ? (items.find(c => c._id === id)?.name || 'Uncategorized') : 'Uncategorized';
          onChange?.(id, name);
        }}
      >
        <option value="">Uncategorized</option>
        {items.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      {allowCreate && (
        <form onSubmit={createCategory} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder={`Add ${type} category (e.g. Salary, Food)`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="add-btn add-btn-fill" type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

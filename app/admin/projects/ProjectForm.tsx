'use client';

import { useState } from 'react';
import { createProject } from './actions';

export default function ProjectForm({ managers }: { managers: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await createProject(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
        <input name="name" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Acme Redesign" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea name="description" rows={3} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Short description..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Manager</label>
        <select name="managerId" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="">-- No Manager (Unassigned) --</option>
          {managers.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">Only managers without active projects are shown.</p>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}

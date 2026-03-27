'use client';

import { useState } from 'react';
import { createUser } from './actions';

export default function UserForm({ projects }: { projects: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'EMPLOYEE'>('EMPLOYEE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await createUser(formData);

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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
        <select 
          name="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value as any)}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
        <input name="name" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jane Doe" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
        <input type="email" name="email" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="jane@company.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
        <input type="password" name="password" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
      </div>

      {role === 'EMPLOYEE' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign to Project (Optional)</label>
          <select name="projectId" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">-- No Project (Unassigned) --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {role === 'MANAGER' && (
        <div className="text-xs text-indigo-600 dark:text-indigo-400 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          To assign this Manager to a project, go to the <b>Manage Projects</b> page and set the manager there to enforce 1:1 constraints.
        </div>
      )}

      <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Personnel'}
      </button>
    </form>
  );
}

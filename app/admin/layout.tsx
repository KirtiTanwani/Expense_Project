import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Hub</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-indigo-800 hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/admin/projects" className="block px-4 py-2 rounded-lg hover:bg-indigo-800 hover:text-white transition">
            Manage Projects
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-indigo-800 hover:text-white transition">
            Personnel / Users
          </Link>
          <Link href="/admin/expenses" className="block px-4 py-2 rounded-lg hover:bg-indigo-800 hover:text-white transition">
            All Expenses
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <form action="/api/auth/logout" method="POST">
            <button className="w-full text-left px-4 py-2 text-indigo-300 hover:text-white transition rounded-lg hover:bg-indigo-800">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white dark:bg-slate-800 shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Logged in as Administrator</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

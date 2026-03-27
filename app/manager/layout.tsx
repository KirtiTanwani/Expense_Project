import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'MANAGER') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Manager Hub</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/manager" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition">
            My Dashboard
          </Link>
          <Link href="/manager/expenses" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition">
            My Expenses
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <form action="/api/auth/logout" method="POST">
            <button className="w-full text-left px-4 py-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white dark:bg-slate-800 shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Manager Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full">
              Manager Role
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

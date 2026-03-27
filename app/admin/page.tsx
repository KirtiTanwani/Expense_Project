import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getSession();
  
  // Strictly check if the user is authenticated AND has the 'ADMIN' role
  if (!session || session.role !== 'ADMIN') {
    redirect('/login'); // Or redirect to a "not authorized" page
  }

  // Parallel fetch stats
  const [projectCount, userCount, managerCount, employeeCount, expenses] = await Promise.all([
    prisma.project.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'MANAGER' } }),
    prisma.user.count({ where: { role: 'EMPLOYEE' } }),
    prisma.expense.findMany({ select: { amount: true } })
  ]);
  const totalExpenseAmount = expenses.reduce((acc: number, current: any) => acc + Number(current.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Metric Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total System Expenses</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Projects</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{projectCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Managers</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{managerCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Employees & Users</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{employeeCount + userCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a href="/admin/projects" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
            Create Project
          </a>
          <a href="/admin/users" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
            Add Employee/Manager
          </a>
        </div>
      </div>
    </div>
  );
}

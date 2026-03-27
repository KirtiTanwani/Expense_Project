import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export default async function EmployeeDashboard() {
  const session = await getSession();
  
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      project: {
        include: { manager: true, employees: true }
      },
      expenses: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
        <h2 className="text-3xl font-bold mb-2">Hello, {user.name}!</h2>
        <p className="text-blue-100 opacity-90">Manage your project assignments and track your employee expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project View */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Current Project</h3>
          {user.project ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Project Name</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{user.project.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Description</span>
                <p className="text-slate-800 dark:text-slate-200">{user.project.description}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Manager</span>
                <p className="text-slate-800 dark:text-slate-200">{user.project.manager?.name || 'Unassigned'}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 italic">You are not currently assigned to any project.</p>
          )}
        </div>

        {/* Recent Expenses View */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Personal Expenses</h3>
            <a href="/employee/expenses" className="text-sm font-medium text-blue-600 hover:underline">View All</a>
          </div>
          
          <div className="space-y-3">
            {user.expenses.length === 0 ? (
              <p className="text-slate-500 italic">No expenses submitted yet.</p>
            ) : (
              user.expenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{expense.description}</p>
                    <p className="text-xs text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">${Number(expense.amount).toFixed(2)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        expense.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        expense.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {expense.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

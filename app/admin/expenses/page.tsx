import prisma from '@/lib/prisma';

export default async function AdminExpensesPage() {
  const expenses = await prisma.expense.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
      project: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">All System Expenses</h2>
          <span className="text-sm font-medium bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full">
            Total: {expenses.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No expenses recorded yet.</td>
                </tr>
              ) : (
                expenses.map((expense: any) => (
                  <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{expense.user.name || expense.user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{expense.user.role}</span>
                    </td>
                    <td className="px-6 py-4">{expense.project ? expense.project.name : <span className="text-slate-400 italic">Personal</span>}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={expense.description || undefined}>{expense.description}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                      ${Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        expense.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

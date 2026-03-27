import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createExpense } from '@/app/actions/expenses';

export default async function ManagerExpensesPage() {
  const session = await getSession();
  if (!session) return null;

  const expenses = await prisma.expense.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Create Expense Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Submit Expense</h2>
            
            <form action={createExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input name="description" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Client Dinner" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
                <input type="number" step="0.01" name="amount" required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="150.00" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition">
                Submit Expense
              </button>
            </form>
          </div>
        </div>

        {/* Expenses List */}
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Expense History</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {expenses.length === 0 ? (
                <div className="p-8 text-center text-slate-500">You haven't submitted any expenses yet.</div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{expense.description}</h3>
                      <p className="text-sm text-slate-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">${Number(expense.amount).toFixed(2)}</p>
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
    </div>
  );
}

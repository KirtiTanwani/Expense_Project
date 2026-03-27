import prisma from '@/lib/prisma';
import UserForm from './UserForm';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['MANAGER', 'EMPLOYEE', 'USER'] } },
    include: { project: true, managedProject: true },
    orderBy: { createdAt: 'desc' }
  });

  const projects = await prisma.project.findMany({
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Create User Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create Personnel</h2>
            <UserForm projects={projects} />
          </div>
        </div>

        {/* User List */}
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Users</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No users found.</div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name || 'Unnamed'} 
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          user.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'EMPLOYEE' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                      
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        {user.role === 'MANAGER' && (
                          <span>Managing: {user.managedProject ? user.managedProject.name : 'Unassigned'}</span>
                        )}
                        {user.role === 'EMPLOYEE' && (
                          <span>Working On: {user.project ? user.project.name : 'Unassigned'}</span>
                        )}
                      </div>
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

import prisma from '@/lib/prisma';
import ProjectForm from './ProjectForm';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { manager: true, _count: { select: { employees: true, expenses: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const availableManagers = await prisma.user.findMany({
    where: { 
      role: 'MANAGER',
      managedProject: null // Must not have a project already
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Create Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create Project</h2>
            <ProjectForm managers={availableManagers} />
          </div>
        </div>

        {/* Project List */}
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Projects</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No projects found.</div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{project.description || 'No description provided.'}</p>
                      <div className="flex gap-4 mt-3 text-xs font-medium text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          Manager: {project.manager ? project.manager.name : 'Unassigned'}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          Employees: {project._count.employees}
                        </span>
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

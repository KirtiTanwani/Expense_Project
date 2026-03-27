'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const managerIdStr = formData.get('managerId') as string;

  if (!name) {
    return { error: 'Project name is required' };
  }

  try {
    const data: any = {
      name,
      description,
    };

    if (managerIdStr) {
      const managerId = managerIdStr;
      // Ensure manager doesn't already have a project
      const existingProject = await prisma.project.findUnique({
        where: { managerId }
      });
      if (existingProject) {
        return { error: 'This manager is already assigned to another project.' };
      }
      data.managerId = managerId;
    }

    await prisma.project.create({ data });
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create project.' };
  }
}

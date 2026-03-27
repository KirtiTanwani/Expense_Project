'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as 'MANAGER' | 'EMPLOYEE';
  const projectIdStr = formData.get('projectId') as string;

  if (!email || !password || !role) {
    return { error: 'Email, password, and role are required.' };
  }

  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) return { error: 'Email already exists.' };

    const hashedPassword = await bcrypt.hash(password, 10);
    const data: any = {
      name,
      email,
      password: hashedPassword,
      role
    };

    if (role === 'EMPLOYEE' && projectIdStr) {
      const projectId = projectIdStr;
      // Check if project exists
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return { error: 'Selected project does not exist.' };
      data.projectId = projectId;
    }

    await prisma.user.create({ data });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to create user.' };
  }
}
